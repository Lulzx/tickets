// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ticket {
    // Mapping of ticket IDs to their respective owners
    mapping (uint256 => address) public ticketOwners;

    // Mapping of ticket IDs to their respective metadata
    mapping (uint256 => Ticket) public tickets;

    uint256 public ticketsCount;

    // Event emitted when a new ticket is minted
    event NewTicket(uint256 ticketId, address owner, string metadata);

    // Event emitted when a ticket is bought
    event TicketBought(uint256 ticketId, address buyer, uint256 price);

    // Event emitted when a ticket is sold
    event TicketSold(uint256 ticketId, address seller, uint256 price);

    // Event emitted when a ticket is traded
    event TicketTraded(uint256 ticketId, address from, address to);

    // Struct to represent a ticket
    struct Ticket {
        string metadata; // JSON metadata of the ticket (e.g. match details, seat info, etc.)
        uint256 price; // current price of the ticket
        bool isForSale; // whether the ticket is for sale
    }

    // Mint a new ticket
    function mintTicket(string memory _metadata, uint256 _price) public {
        uint256 newTicketId = uint256(keccak256(abi.encodePacked(_metadata, block.timestamp)));
        Ticket memory newTicket = Ticket(_metadata, _price, true);
        tickets[newTicketId] = newTicket;
        ticketOwners[newTicketId] = msg.sender;
        ticketsCount++;
        emit NewTicket(newTicketId, msg.sender, _metadata);
    }

    // Buy a ticket
    function buyTicket(uint256 _ticketId) public payable {
        require(tickets[_ticketId].isForSale, "Ticket is not for sale");
        require(msg.value >= tickets[_ticketId].price, "Insufficient funds");
        address seller = ticketOwners[_ticketId];
        ticketOwners[_ticketId] = msg.sender;
        tickets[_ticketId].isForSale = false;
        emit TicketBought(_ticketId, msg.sender, tickets[_ticketId].price);
        payable(seller).transfer(tickets[_ticketId].price);
    }

    // Sell a ticket
    function sellTicket(uint256 _ticketId, uint256 _newPrice) public {
        require(ticketOwners[_ticketId] == msg.sender, "Only the owner can sell the ticket");
        tickets[_ticketId].price = _newPrice;
        tickets[_ticketId].isForSale = true;
        emit TicketSold(_ticketId, msg.sender, _newPrice);
    }

    // Trade a ticket
    function tradeTicket(uint256 _ticketId, address _newOwner) public {
        require(ticketOwners[_ticketId] == msg.sender, "Only the owner can trade the ticket");
        ticketOwners[_ticketId] = _newOwner;
        emit TicketTraded(_ticketId, msg.sender, _newOwner);
    }

    // Get the owner of a ticket
    function getTicketOwner(uint256 _ticketId) public view returns (address) {
        return ticketOwners[_ticketId];
    }

    // Get the metadata of a ticket
    function getTicketMetadata(uint256 _ticketId) public view returns (string memory) {
        return tickets[_ticketId].metadata;
    }

    // Get the price of a ticket
    function getTicketPrice(uint256 _ticketId) public view returns (uint256) {
        return tickets[_ticketId].price;
    }

    // Get the number of total tickets
    function getTicketCount() public view returns (uint256) {
        return ticketsCount;
    }

    // Get whether a ticket is for sale
    function isTicketForSale(uint256 _ticketId) public view returns (bool) {
        return tickets[_ticketId].isForSale;
    }
}
