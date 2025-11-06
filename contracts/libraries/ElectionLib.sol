// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ElectionLib
/// @notice Library for common election types and helpers
library ElectionLib {
    /// @notice Voting mode types
    enum VotingMode {
        Open,
        Allowlist,
        TokenGated
    }

    /// @notice Candidate data
    struct Candidate {
        uint256 id;
        string name;
        string metadataUrl;
        uint256 voteCount;
    }

    /// @notice Metadata describing an election
    struct ElectionMeta {
        string title;
        string description;
        uint64 startTime;
        uint64 endTime;
    }
}


