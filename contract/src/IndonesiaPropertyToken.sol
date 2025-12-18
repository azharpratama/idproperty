// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IndonesiaPropertyToken
/// @author Azhar Aditya Pratama
/// @notice ERC-20 token representing fractional ownership of Indonesian real estate
/// @dev Implements compliance checks via KYCRegistry, inspired by ERC-3643

contract IndonesiaPropertyToken {
    // ============================================
    // CUSTOM ERRORS (Gas Optimization!)
    // ============================================

    error NotAdmin();
    error NotPendingAdmin();
    error InvalidAddress();
    error InvalidKYCRegistry();
    error NotKYCVerified();
    error AccountIsFrozen();
    error InsufficientBalance();
    error InsufficientAllowance();
    error ExceedsMaxInvestment();
    error BelowMinInvestment();
    error InvalidLimits();
    error TransferToSelf();
    error ContractPaused();

    // ============================================
    // TOKEN METADATA
    // ============================================

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    // ============================================
    // PROPERTY INFO
    // ============================================

    /// @notice Property details structure
    struct PropertyInfo {
        string propertyName; // "Apartemen Sudirman Tower"
        string location; // "Jakarta Selatan"
        uint256 totalValue; // Total property value in IDR
        uint256 totalTokens; // Total tokens representing 100%
        string legalDocument; // IPFS hash of legal docs
        bool isActive;
    }

    PropertyInfo public property;

    // ============================================
    // COMPLIANCE
    // ============================================

    address public admin;
    address public pendingAdmin;
    address public kycRegistry;
    bool public paused;

    mapping(address => bool) public frozen;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    uint256 public minInvestment = 1 ether;
    uint256 public maxInvestment = 1000 ether;

    // ============================================
    // EVENTS
    // ============================================

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event AccountFrozen(address indexed account, string reason);
    event AccountUnfrozen(address indexed account);
    event PropertyUpdated(string propertyName, uint256 totalValue);
    event InvestmentLimitsUpdated(uint256 minInvestment, uint256 maxInvestment);
    event AdminTransferProposed(
        address indexed currentAdmin,
        address indexed pendingAdmin
    );
    event AdminTransferAccepted(
        address indexed oldAdmin,
        address indexed newAdmin
    );
    event ForceTransferExecuted(
        address indexed from,
        address indexed to,
        uint256 value,
        string reason
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

    modifier notFrozen(address _account) {
        if (frozen[_account]) revert AccountIsFrozen();
        _;
    }

    modifier validAddress(address _addr) {
        if (_addr == address(0)) revert InvalidAddress();
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================

    /// @notice Deploy property token
    /// @param _name Token name (e.g., "Sudirman Tower Token")
    /// @param _symbol Token symbol (e.g., "SDMN")
    /// @param _kycRegistry Address of deployed KYCRegistry
    /// @param _propertyName Name of the property
    /// @param _location Property location
    /// @param _totalValue Total property value in IDR
    /// @param _totalTokens Total tokens to mint (representing 100%)
    constructor(
        string memory _name,
        string memory _symbol,
        address _kycRegistry,
        string memory _propertyName,
        string memory _location,
        uint256 _totalValue,
        uint256 _totalTokens
    ) {
        if (_kycRegistry == address(0)) revert InvalidKYCRegistry();

        name = _name;
        symbol = _symbol;
        admin = msg.sender;
        kycRegistry = _kycRegistry;

        property = PropertyInfo({
            propertyName: _propertyName,
            location: _location,
            totalValue: _totalValue,
            totalTokens: _totalTokens,
            legalDocument: "",
            isActive: true
        });

        // Mint all tokens to admin initially
        totalSupply = _totalTokens;
        balances[msg.sender] = _totalTokens;
        emit Transfer(address(0), msg.sender, _totalTokens);
    }

    // ============================================
    // ERC-20 FUNCTIONS
    // ============================================

    /// @notice Get balance of an address
    /// @param _owner Address to query
    /// @return Balance of the address
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    /// @notice Transfer tokens with compliance checks
    /// @dev Both sender and receiver must be KYC verified and not frozen
    /// @param _to Recipient address
    /// @param _value Amount to transfer
    /// @return success True if transfer succeeded
    function transfer(
        address _to,
        uint256 _value
    )
        public
        whenNotPaused
        notFrozen(msg.sender)
        notFrozen(_to)
        validAddress(_to)
        returns (bool success)
    {
        if (msg.sender == _to) revert TransferToSelf();
        if (!_isVerified(msg.sender)) revert NotKYCVerified();
        if (!_isVerified(_to)) revert NotKYCVerified();
        if (balances[msg.sender] < _value) revert InsufficientBalance();

        // Check min investment for receiver (skip if receiver already has tokens)
        if (balances[_to] == 0 && _value < minInvestment)
            revert BelowMinInvestment();

        uint256 newBalance = balances[_to] + _value;
        if (newBalance > maxInvestment) revert ExceedsMaxInvestment();

        unchecked {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
        }

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /// @notice Approve spender to use tokens
    /// @param _spender Address to approve
    /// @param _value Amount to approve
    /// @return success True if approval succeeded
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /// @notice Get allowance for spender
    /// @param _owner Token owner
    /// @param _spender Approved spender
    /// @return Remaining allowance
    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    /// @notice Transfer tokens on behalf of owner
    /// @param _from Token owner
    /// @param _to Recipient
    /// @param _value Amount to transfer
    /// @return success True if transfer succeeded
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        whenNotPaused
        notFrozen(_from)
        notFrozen(_to)
        validAddress(_to)
        returns (bool success)
    {
        if (!_isVerified(_from)) revert NotKYCVerified();
        if (!_isVerified(_to)) revert NotKYCVerified();
        if (balances[_from] < _value) revert InsufficientBalance();
        if (allowances[_from][msg.sender] < _value)
            revert InsufficientAllowance();

        // Check min investment for receiver (skip if receiver already has tokens)
        if (balances[_to] == 0 && _value < minInvestment)
            revert BelowMinInvestment();

        uint256 newBalance = balances[_to] + _value;
        if (newBalance > maxInvestment) revert ExceedsMaxInvestment();

        unchecked {
            balances[_from] -= _value;
            balances[_to] += _value;
            allowances[_from][msg.sender] -= _value;
        }

        emit Transfer(_from, _to, _value);
        return true;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    /// @notice Freeze account for AML/compliance
    /// @param _account Account to freeze
    /// @param _reason Reason for freezing
    function freezeAccount(
        address _account,
        string calldata _reason
    ) external onlyAdmin validAddress(_account) {
        frozen[_account] = true;
        emit AccountFrozen(_account, _reason);
    }

    /// @notice Unfreeze a frozen account
    /// @param _account Account to unfreeze
    function unfreezeAccount(address _account) external onlyAdmin {
        frozen[_account] = false;
        emit AccountUnfrozen(_account);
    }

    /// @notice Force transfer for legal compliance/recovery
    /// @param _from Source account
    /// @param _to Destination account
    /// @param _value Amount to transfer
    /// @param _reason Reason for force transfer
    function forceTransfer(
        address _from,
        address _to,
        uint256 _value,
        string calldata _reason
    ) external onlyAdmin validAddress(_to) {
        if (balances[_from] < _value) revert InsufficientBalance();

        unchecked {
            balances[_from] -= _value;
            balances[_to] += _value;
        }

        emit Transfer(_from, _to, _value);
        emit ForceTransferExecuted(_from, _to, _value, _reason);
    }

    /// @notice Update property legal documents (IPFS hash)
    /// @param _ipfsHash New IPFS hash
    function setLegalDocument(string calldata _ipfsHash) external onlyAdmin {
        property.legalDocument = _ipfsHash;
    }

    /// @notice Update property value (reappraisal)
    /// @param _newValue New property value in IDR
    function updatePropertyValue(uint256 _newValue) external onlyAdmin {
        property.totalValue = _newValue;
        emit PropertyUpdated(property.propertyName, _newValue);
    }

    /// @notice Update investment limits
    /// @param _min Minimum investment
    /// @param _max Maximum investment
    function setInvestmentLimits(
        uint256 _min,
        uint256 _max
    ) external onlyAdmin {
        if (_min >= _max) revert InvalidLimits();
        minInvestment = _min;
        maxInvestment = _max;
        emit InvestmentLimitsUpdated(_min, _max);
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

    /// @notice Pause all transfers (emergency)
    function pause() external onlyAdmin {
        paused = true;
        emit Paused(msg.sender);
    }

    /// @notice Unpause transfers
    function unpause() external onlyAdmin {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /// @notice Get ownership percentage in basis points
    /// @param _owner Address to check
    /// @return Ownership in basis points (100% = 10000)
    function getOwnershipPercent(address _owner) public view returns (uint256) {
        if (totalSupply == 0) return 0;
        return (balances[_owner] * 10000) / totalSupply;
    }

    /// @notice Get token value in IDR
    /// @return Value per token in IDR
    function getTokenValueIDR() public view returns (uint256) {
        if (property.totalTokens == 0) return 0;
        return property.totalValue / (property.totalTokens / 1 ether);
    }

    /// @notice Get holder's value in IDR
    /// @param _owner Address to check
    /// @return Value of holdings in IDR
    function getHolderValueIDR(address _owner) public view returns (uint256) {
        if (totalSupply == 0) return 0;
        return (balances[_owner] * property.totalValue) / totalSupply;
    }

    /// @notice Check if transfer would be allowed
    /// @param _from Sender address
    /// @param _to Recipient address
    /// @param _value Amount to transfer
    /// @return allowed True if transfer is allowed
    /// @return reason Reason if not allowed
    function canTransfer(
        address _from,
        address _to,
        uint256 _value
    ) public view returns (bool allowed, string memory reason) {
        if (paused) return (false, "Contract is paused");
        if (frozen[_from]) return (false, "Sender is frozen");
        if (frozen[_to]) return (false, "Receiver is frozen");
        if (!_isVerified(_from)) return (false, "Sender not KYC verified");
        if (!_isVerified(_to)) return (false, "Receiver not KYC verified");
        if (balances[_from] < _value) return (false, "Insufficient balance");
        if (balances[_to] == 0 && _value < minInvestment)
            return (false, "Below min investment");
        if (balances[_to] + _value > maxInvestment)
            return (false, "Exceeds max investment");

        return (true, "Transfer allowed");
    }

    /// @notice Check if an account is frozen
    /// @param _account Account to check
    /// @return True if frozen
    function isFrozen(address _account) external view returns (bool) {
        return frozen[_account];
    }

    // ============================================
    // INTERNAL FUNCTIONS
    // ============================================

    /// @notice Check if account is KYC verified
    /// @param _account Account to verify
    /// @return True if verified
    function _isVerified(address _account) internal view returns (bool) {
        // Admin is always verified
        if (_account == admin) return true;

        // Check KYC registry
        (bool success, bytes memory data) = kycRegistry.staticcall(
            abi.encodeWithSignature("isVerified(address)", _account)
        );

        if (!success) return false;
        return abi.decode(data, (bool));
    }
}
