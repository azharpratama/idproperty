// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title KYCRegistry
/// @author Azhar Aditya Pratama
/// @notice Manages KYC verification for IndonesiaPropertyToken
/// @dev Deploy this contract first, then use its address in PropertyToken

contract KYCRegistry {
    // ============================================
    // CUSTOM ERRORS (Gas Optimization!)
    // ============================================

    error NotAdmin();
    error NotPendingAdmin();
    error InvalidAddress();
    error InvalidKYCLevel();
    error AlreadyRegistered();
    error NotRegistered();
    error ContractPaused();

    // ============================================
    // ENUMS & STRUCTS
    // ============================================

    /// @notice KYC verification levels
    enum KYCLevel {
        NONE, // 0 - Belum KYC
        BASIC, // 1 - KYC dasar (KTP)
        VERIFIED, // 2 - KYC lengkap (KTP + NPWP)
        ACCREDITED // 3 - Investor terakreditasi
    }

    /// @notice Investor data structure
    struct Investor {
        KYCLevel level;
        uint256 expiryDate;
        uint16 countryCode; // 360 = Indonesia
        bool isActive;
    }

    // ============================================
    // STATE VARIABLES
    // ============================================

    address public admin;
    address public pendingAdmin;
    uint256 public totalInvestors;
    bool public paused;

    /// @notice Mapping of investor address to their data
    mapping(address => Investor) public investors;

    // ============================================
    // EVENTS
    // ============================================

    event InvestorRegistered(
        address indexed investor,
        KYCLevel level,
        uint16 countryCode,
        uint256 expiryDate
    );
    event InvestorUpdated(
        address indexed investor,
        KYCLevel oldLevel,
        KYCLevel newLevel
    );
    event InvestorRevoked(address indexed investor);
    event AdminTransferProposed(
        address indexed currentAdmin,
        address indexed pendingAdmin
    );
    event AdminTransferAccepted(
        address indexed oldAdmin,
        address indexed newAdmin
    );
    event Paused(address indexed admin);
    event Unpaused(address indexed admin);

    // ============================================
    // MODIFIERS
    // ============================================

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert ContractPaused();
        _;
    }

    modifier validAddress(address _addr) {
        if (_addr == address(0)) revert InvalidAddress();
        _;
    }

    modifier investorExists(address _investor) {
        if (!investors[_investor].isActive) revert NotRegistered();
        _;
    }

    modifier investorNotExists(address _investor) {
        if (investors[_investor].isActive) revert AlreadyRegistered();
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor() {
        admin = msg.sender;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    /// @notice Register new investor after KYC verification
    /// @param _investor Wallet address of investor
    /// @param _level KYC level (1-3)
    /// @param _countryCode Country code (360 for Indonesia)
    /// @param _validDays How many days KYC is valid
    function registerInvestor(
        address _investor,
        KYCLevel _level,
        uint16 _countryCode,
        uint256 _validDays
    )
        external
        onlyAdmin
        whenNotPaused
        validAddress(_investor)
        investorNotExists(_investor)
    {
        if (_level == KYCLevel.NONE) revert InvalidKYCLevel();

        investors[_investor] = Investor({
            level: _level,
            expiryDate: block.timestamp + (_validDays * 1 days),
            countryCode: _countryCode,
            isActive: true
        });

        unchecked {
            totalInvestors++;
        }

        emit InvestorRegistered(
            _investor,
            _level,
            _countryCode,
            investors[_investor].expiryDate
        );
    }

    /// @notice Update investor KYC level
    /// @param _investor Investor address
    /// @param _newLevel New KYC level
    function updateInvestor(
        address _investor,
        KYCLevel _newLevel
    ) external onlyAdmin whenNotPaused investorExists(_investor) {
        KYCLevel oldLevel = investors[_investor].level;
        investors[_investor].level = _newLevel;
        emit InvestorUpdated(_investor, oldLevel, _newLevel);
    }

    /// @notice Extend investor KYC expiry
    /// @param _investor Investor address
    /// @param _additionalDays Days to add to expiry
    function extendExpiry(
        address _investor,
        uint256 _additionalDays
    ) external onlyAdmin whenNotPaused investorExists(_investor) {
        investors[_investor].expiryDate += _additionalDays * 1 days;
    }

    /// @notice Revoke investor KYC (blacklist)
    /// @param _investor Investor address to revoke
    function revokeInvestor(
        address _investor
    ) external onlyAdmin investorExists(_investor) {
        investors[_investor].isActive = false;

        unchecked {
            totalInvestors--;
        }

        emit InvestorRevoked(_investor);
    }

    /// @notice Propose new admin (two-step transfer)
    /// @param _newAdmin Proposed new admin address
    function proposeAdmin(
        address _newAdmin
    ) external onlyAdmin validAddress(_newAdmin) {
        pendingAdmin = _newAdmin;
        emit AdminTransferProposed(admin, _newAdmin);
    }

    /// @notice Accept admin role (must be called by pending admin)
    function acceptAdmin() external {
        if (msg.sender != pendingAdmin) revert NotPendingAdmin();

        address oldAdmin = admin;
        admin = pendingAdmin;
        pendingAdmin = address(0);

        emit AdminTransferAccepted(oldAdmin, admin);
    }

    /// @notice Pause contract (emergency stop)
    function pause() external onlyAdmin {
        paused = true;
        emit Paused(msg.sender);
    }

    /// @notice Unpause contract
    function unpause() external onlyAdmin {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /// @notice Check if investor is verified and active
    /// @param _investor Investor address to check
    /// @return bool True if investor is verified
    function isVerified(address _investor) public view returns (bool) {
        Investor memory inv = investors[_investor];

        if (!inv.isActive) return false;
        if (inv.level == KYCLevel.NONE) return false;
        if (block.timestamp > inv.expiryDate) return false;

        return true;
    }

    /// @notice Check if investor meets minimum KYC level
    /// @param _investor Investor address
    /// @param _requiredLevel Minimum required level
    /// @return bool True if investor meets level
    function meetsLevel(
        address _investor,
        KYCLevel _requiredLevel
    ) public view returns (bool) {
        if (!isVerified(_investor)) return false;
        return uint8(investors[_investor].level) >= uint8(_requiredLevel);
    }

    /// @notice Get investor details
    /// @param _investor Investor address
    /// @return level KYC level
    /// @return expiryDate Expiry timestamp
    /// @return countryCode Country code
    /// @return isActive Active status
    function getInvestor(
        address _investor
    )
        external
        view
        returns (
            KYCLevel level,
            uint256 expiryDate,
            uint16 countryCode,
            bool isActive
        )
    {
        Investor memory inv = investors[_investor];
        return (inv.level, inv.expiryDate, inv.countryCode, inv.isActive);
    }

    /// @notice Get days until KYC expires
    /// @param _investor Investor address
    /// @return Days remaining (0 if expired)
    function getDaysUntilExpiry(
        address _investor
    ) external view returns (uint256) {
        Investor memory inv = investors[_investor];
        if (block.timestamp >= inv.expiryDate) return 0;
        return (inv.expiryDate - block.timestamp) / 1 days;
    }
}
