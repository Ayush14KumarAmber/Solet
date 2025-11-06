// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

import {Election} from "./Election.sol";
import {ElectionLib} from "./libraries/ElectionLib.sol";

/// @title VotingFactory
/// @notice Factory to create and track elections. Only admins can create elections.
contract VotingFactory is AccessControl, Pausable, ReentrancyGuard {
    /// @notice Role identifier for admins allowed to create elections
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Emitted when a new election is created
    event ElectionCreated(address indexed electionAddress, uint256 indexed electionId, address indexed creator);

    /// @notice All created election contract addresses
    address[] public elections;

    /// @notice Custom errors
    error NotAdmin();
    error InvalidTimeWindow();

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(ADMIN_ROLE, initialAdmin);
    }

    /// @notice Returns the number of elections
    function getElectionsCount() external view returns (uint256) {
        return elections.length;
    }

    /// @notice Create a new election contract
    /// @param meta The metadata of the election
    /// @param mode Voting mode to use
    /// @param token Address of ERC20 token (for token-gated mode), else zero address
    /// @param minBalance Minimum token balance required (for token-gated mode)
    /// @param allowlist Optional initial allowlist
    function createElection(
        ElectionLib.ElectionMeta calldata meta,
        ElectionLib.VotingMode mode,
        address token,
        uint256 minBalance,
        address[] calldata allowlist
    ) external nonReentrant whenNotPaused returns (address electionAddress) {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        if (meta.startTime >= meta.endTime) revert InvalidTimeWindow();

        Election election = new Election({
            _admin: msg.sender,
            _meta: meta,
            _mode: mode,
            _token: token,
            _minBalance: minBalance,
            _factory: address(this)
        });

        if (allowlist.length > 0) {
            election.setAllowlist(allowlist, true);
        }

        electionAddress = address(election);
        elections.push(electionAddress);
        emit ElectionCreated(electionAddress, elections.length - 1, msg.sender);
    }

    /// @notice Pause factory (prevents new elections)
    function pause() external {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        _pause();
    }

    /// @notice Unpause factory
    function unpause() external {
        if (!hasRole(ADMIN_ROLE, msg.sender)) revert NotAdmin();
        _unpause();
    }
}


