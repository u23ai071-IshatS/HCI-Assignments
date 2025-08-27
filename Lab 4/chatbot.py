def chatbot():
    print("Chatbot: Hello! Welcome to Flight Ticket Booking System.")
    
    # Ask destination
    destination = input("Chatbot: Where would you like to travel?\n")
    if not destination.strip():
        print("Chatbot: Invalid input! Please enter a valid destination.\n")
        return
    
    # Ask date
    date = input("Chatbot: Please enter your travel date (DD/MM/YYYY): \n")
    if not date.strip():
        print("Chatbot: Invalid input! Please enter a valid date.\n")
        return
    
    # Confirm booking
    confirm = input(f"Chatbot: You want to book a ticket to {destination} on {date}? (yes/no): \n").lower()
    if confirm != "yes":
        print("Chatbot: Booking cancelled. Goodbye!\n")
        return
    
    # Payment
    payment = input("Chatbot: Proceed with payment? (yes/no): \n").lower()
    if payment != "yes":
        print("Chatbot: Payment cancelled. Goodbye!\n")
        return
    
    print("Chatbot: Payment successful! Your ticket has been booked.\n")
    print("Chatbot: Thank you for using our system. Have a safe journey!\n")

# Run chatbot
if __name__ == "__main__":
    chatbot()
