// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ElectionLib} from "./libraries/ElectionLib.sol";

/// @title Election
/// @notice Individual election with voting modes, allowlist and token-gating
contract Election is AccessControl, Ownable, Pausable, ReentrancyGuard {
    using ElectionLib for ElectionLib.Candidate;

    /// @notice Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Events
    event VoteCast(address indexed voter, uint256 indexed candidateId, uint256 timestamp);
    event ElectionPaused();
    event ElectionClosed();

    /// @notice Errors
    error NotAdmin();
    error ElectionNotActive();
    error AlreadyVoted();
    error InvalidCandidate();
    error InvalidWindow();
    error Closed();
    error NotEligible();

    /// @notice Factory that created this election
    address public immutable factory;

    /// @notice Election metadata
    ElectionLib.ElectionMeta public meta;

    /// @notice Voting mode
    ElectionLib.VotingMode public votingMode;

    /// @notice Token gating config
    address public tokenAddress; // ERC20 token for gating
    uint256 public minTokenBalance; // minimum balance required

    /// @notice Allowlist mapping
    mapping(address => bool) public isAllowlisted;

    /// @notice Prevent double voting
    mapping(address => bool) public hasVoted;

    /// @notice Candidates storage
    ElectionLib.Candidate[] private _candidates;

    /// @notice Closed flag
    bool public isClosed;

    /// @notice Constructor
    /// @param _admin Admin address
    /// @param _meta Election metadata
    /// @param _mode Voting mode
    /// @param _token Token address for token-gated mode
    /// @param _minBalance Minimum token balance for token-gated mode
    /// @param _factory Factory address
    constructor(
        address _admin,
        ElectionLib.ElectionMeta memory _meta,
        ElectionLib.VotingMode _mode,
        address _token,
        uint256 _minBalance,
        address _factory
    ) Ownable(_admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        factory = _factory;
        meta = _meta;
        if (_meta.startTime >= _meta.endTime) revert InvalidWindow();
        votingMode = _mode;
        tokenAddress = _token;
        minTokenBalance = _minBalance;
    }

    /// @notice Get number of candidates
    function candidatesCount() external view returns (uint256) {
        return _candidates.length;
    }

    /// @notice Get candidate by index
    function getCandidate(uint256 index) external view returns (ElectionLib.Candidate memory) {
        return _candidates[index];
    }

    /// @notice Add candidates (admin)
    /// @param names Candidate names; ids auto-assigned in order
    /// @param metadataUrls Candidate metadata URLs corresponding to names
    function addCandidates(
        string[] calldata names,
        string[] calldata metadataUrls
    ) external whenNotPaused {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        if (names.length == 0 || names.length != metadataUrls.length) revert InvalidCandidate();

        uint256 length = names.length;
        uint256 baseId = _candidates.length;
        for (uint256 i = 0; i < length; i++) {
            _candidates.push(ElectionLib.Candidate({
                id: baseId + i,
                name: names[i],
                metadataUrl: metadataUrls[i],
                voteCount: 0
            }));
        }
    }

    /// @notice Set or unset allowlist entries (admin)
    function setAllowlist(address[] calldata addrs, bool allowed) external whenNotPaused {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        uint256 length = addrs.length;
        for (uint256 i = 0; i < length; i++) {
            isAllowlisted[addrs[i]] = allowed;
        }
    }

    /// @notice Set voting mode and token gate config (admin)
    function setVotingMode(
        ElectionLib.VotingMode mode,
        address token,
        uint256 minBalance
    ) external whenNotPaused {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        votingMode = mode;
        tokenAddress = token;
        minTokenBalance = minBalance;
    }

    /// @notice Pause election (admin)
    function pause() external {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        _pause();
        emit ElectionPaused();
    }

    /// @notice Unpause election (admin)
    function unpause() external {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        _unpause();
    }

    /// @notice Close election (admin)
    function close() external whenNotPaused {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        isClosed = true;
        emit ElectionClosed();
    }

    /// @notice Cast a vote for candidate id
    function vote(uint256 candidateId) external nonReentrant whenNotPaused {
        if (isClosed) revert Closed();

        uint64 start = meta.startTime;
        uint64 end = meta.endTime;
        // solhint-disable-next-line not-rely-on-time
        if (block.timestamp < start || block.timestamp > end) revert ElectionNotActive();
        if (hasVoted[msg.sender]) revert AlreadyVoted();

        _checkEligibility(msg.sender);

        // load to memory and validate index
        uint256 numCandidates = _candidates.length;
        if (candidateId >= numCandidates) revert InvalidCandidate();

        // increment in storage (minimal writes: one mapping write, one candidate write)
        hasVoted[msg.sender] = true;
        _candidates[candidateId].voteCount += 1;

        emit VoteCast(msg.sender, candidateId, block.timestamp);
    }

    /// @notice Internal eligibility check based on mode
    function _checkEligibility(address voter) internal view {
        ElectionLib.VotingMode mode = votingMode;
        if (mode == ElectionLib.VotingMode.Open) {
            return;
        }
        if (mode == ElectionLib.VotingMode.Allowlist) {
            if (!isAllowlisted[voter]) revert NotEligible();
            return;
        }
        if (mode == ElectionLib.VotingMode.TokenGated) {
            if (tokenAddress == address(0)) revert NotEligible();
            uint256 balance = IERC20(tokenAddress).balanceOf(voter);
            if (balance < minTokenBalance) revert NotEligible();
            return;
        }
        // unreachable for defined enum values
        revert NotEligible();
    }
}


