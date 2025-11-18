# 📄 Smart Contract Overview

This project ships with four Solidity contracts that work together to power the Solet voting dApp. Below is a quick-reference guide describing their responsibilities and key features.

## 1. `VotingFactory.sol`
- **Purpose:** Main entry point that lets admins spin up new elections and keep track of every deployed `Election` instance.
- **Key Features:**
  - Uses `AccessControl`, `Pausable`, and `ReentrancyGuard` from OpenZeppelin for safety.
  - Only addresses with `ADMIN_ROLE` can call `createElection`.
  - Emits `ElectionCreated` events and stores every election address in `elections[]`.
  - Supports optional allowlists and token-gating parameters which are passed to the child `Election` contract.
  - Includes pause/unpause toggles to temporarily stop creation of new elections.

## 2. `Election.sol`
- **Purpose:** Represents a single election. Handles candidate management, voting eligibility, and vote recording.
- **Key Features:**
  - Integrates `AccessControl`, `Ownable`, `Pausable`, and `ReentrancyGuard` for admin controls and security.
  - Supports three voting modes defined in `ElectionLib`: Open, Allowlist, TokenGated.
  - Allows admins to add candidates, manage allowlists, change voting mode, pause/unpause, and close elections.
  - Ensures fair voting with double-vote prevention (`hasVoted` mapping) and strict window checks (`startTime`/`endTime`).
  - Emits `VoteCast`, `ElectionPaused`, and `ElectionClosed` events for off-chain indexers.
  - Token-gated mode checks `IERC20` balances against a configurable `minTokenBalance`.

## 3. `libraries/ElectionLib.sol`
- **Purpose:** Shared data structures and enums used by both `VotingFactory` and `Election`.
- **Contents:**
  - `VotingMode` enum with `Open`, `Allowlist`, and `TokenGated` options.
  - `Candidate` struct storing `id`, `name`, `metadataUrl`, and `voteCount`.
  - `ElectionMeta` struct holding the election’s `title`, `description`, `startTime`, and `endTime`.
- **Why it exists:** Keeps shared types in one place, reduces duplication, and makes ABI generation smaller for the frontend.

## 4. `mocks/MockERC20.sol`
- **Purpose:** Lightweight ERC20 token used in local tests and token-gated election demos.
- **Key Features:**
  - Extends OpenZeppelin’s `ERC20` implementation.
  - Exposes a simple `mint(address to, uint256 amount)` method so test scripts can grant voting power quickly.
  - Helpful when demonstrating or testing token-gated voting without deploying a full token project.

---
Use this document as a quick refresher when working across smart contracts, writing tests, or explaining the architecture to others.
