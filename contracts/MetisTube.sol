// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MetisTube is ERC721 {
    struct Statistic {
        uint256 likes;
        uint256 dislikes;
    }

    uint256 private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Statistic) public tokenStatistics;
    mapping(uint256 => mapping(address => bool)) public likes;
    mapping(uint256 => mapping(address => bool)) public dislikes;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function claimToken(address _claimer, string memory _tokenURI)
        public
        returns (uint256)
    {
        _mint(_claimer, _tokenIds);
        _setTokenURI(_tokenIds, _tokenURI);

        _tokenIds++;

        return _tokenIds;
    }

    function toggleLike(uint256 tokenId, bool value) public {
        require(likes[tokenId][msg.sender] != value);
        likes[tokenId][msg.sender] = value;
        if (value) {
            tokenStatistics[tokenId].likes += 1;
        } else {
            tokenStatistics[tokenId].likes -= 1;
        }
    }

    function toggleDislike(uint256 tokenId, bool value) public {
        require(dislikes[tokenId][msg.sender] != value);
        dislikes[tokenId][msg.sender] = value;
        if (value) {
            tokenStatistics[tokenId].dislikes += 1;
        } else {
            tokenStatistics[tokenId].dislikes -= 1;
        }
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return _tokenURIs[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
}
