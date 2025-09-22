// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ImpactCertificate is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct Certificate {
        uint256 id;
        address donor;
        uint256 amount;
        uint256 timestamp;
        string projectName;
        bool exists;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public userCertificates;
    mapping(address => uint256) public totalDonated;

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed donor,
        uint256 amount,
        string projectName,
        uint256 timestamp
    );

    constructor() ERC721("HyperFill Impact Certificate", "HIC") {}

    function mintCertificate(
        address donor,
        uint256 amount,
        string memory projectName,
        string memory uri
    ) public onlyOwner returns (uint256) {
        require(donor != address(0), "Invalid donor address");
        require(amount > 0, "Amount must be greater than 0");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(donor, tokenId);
        _setTokenURI(tokenId, uri);

        Certificate memory newCert = Certificate({
            id: tokenId,
            donor: donor,
            amount: amount,
            timestamp: block.timestamp,
            projectName: projectName,
            exists: true
        });

        certificates[tokenId] = newCert;
        userCertificates[donor].push(tokenId);
        totalDonated[donor] += amount;

        emit CertificateMinted(tokenId, donor, amount, projectName, block.timestamp);

        return tokenId;
    }

    function getUserCertificates(address user) public view returns (uint256[] memory) {
        return userCertificates[user];
    }

    function getCertificate(uint256 tokenId) public view returns (Certificate memory) {
        require(certificates[tokenId].exists, "Certificate does not exist");
        return certificates[tokenId];
    }

    function getUserTotalDonated(address user) public view returns (uint256) {
        return totalDonated[user];
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}