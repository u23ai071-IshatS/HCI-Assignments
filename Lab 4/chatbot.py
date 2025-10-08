import datetime
import re
import random

class FlightBookingChatbot:
    def __init__(self):
        self.destinations = {
            "mumbai": {"code": "BOM", "price": 5000},
            "delhi": {"code": "DEL", "price": 4500},
            "bangalore": {"code": "BLR", "price": 5500},
            "chennai": {"code": "MAA", "price": 4800},
            "kolkata": {"code": "CCU", "price": 4200},
            "hyderabad": {"code": "HYD", "price": 5200},
            "pune": {"code": "PNQ", "price": 4600},
            "ahmedabad": {"code": "AMD", "price": 3800},
            "goa": {"code": "GOI", "price": 6000},
            "kochi": {"code": "COK", "price": 5800}
        }
        
        self.booking_details = {}
    
    def display_welcome(self):
        print("=" * 50)
        print("   ✈️  FLIGHT TICKET BOOKING SYSTEM  ✈️")
        print("=" * 50)
        print("Welcome! Let's book your perfect flight today.")
        print()
    
    def display_destinations(self):
        print("📍 Available Destinations:")
        print("-" * 30)
        for city, info in self.destinations.items():
            print(f"{city.title()} ({info['code']}) - ₹{info['price']}")
        print()
    
    def get_destination(self):
        while True:
            self.display_destinations()
            destination = input("🎯 Where would you like to travel? ").strip().lower()
            
            if not destination:
                print("❌ Invalid input! Please enter a valid destination.\n")
                continue
            
            if destination in self.destinations:
                return destination
            else:
                print(f"❌ Sorry, we don't have flights to '{destination}'.")
                retry = input("Would you like to see available destinations again? (yes/no): ").lower()
                if retry != "yes":
                    return None
    
    def validate_date(self, date_str):
        """Validate date format and ensure it's not in the past"""
        try:
            date_obj = datetime.datetime.strptime(date_str, "%d/%m/%Y")
            today = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            
            if date_obj < today:
                return False, "❌ Cannot book flights for past dates!"
            elif date_obj > today + datetime.timedelta(days=365):
                return False, "❌ Cannot book flights more than 1 year in advance!"
            else:
                return True, "✅ Valid date"
                
        except ValueError:
            return False, "❌ Invalid date format! Please use DD/MM/YYYY format."
    
    def get_travel_date(self):
        while True:
            print("📅 When would you like to travel?")
            date = input("Please enter your travel date (DD/MM/YYYY): ").strip()
            
            if not date:
                print("❌ Invalid input! Please enter a valid date.\n")
                continue
            
            is_valid, message = self.validate_date(date)
            print(message)
            
            if is_valid:
                return date
            else:
                retry = input("Would you like to try another date? (yes/no): ").lower()
                if retry != "yes":
                    return None
    
    def get_passenger_count(self):
        while True:
            try:
                passengers = int(input("👥 How many passengers? (1-9): "))
                if 1 <= passengers <= 9:
                    return passengers
                else:
                    print("❌ Please enter a number between 1 and 9.")
            except ValueError:
                print("❌ Please enter a valid number.")
    
    def get_passenger_details(self, count):
        passengers = []
        for i in range(count):
            print(f"\n--- Passenger {i+1} Details ---")
            while True:
                name = input(f"Full name for passenger {i+1}: ").strip()
                if name and len(name) >= 2:
                    passengers.append(name.title())
                    break
                else:
                    print("❌ Please enter a valid name (at least 2 characters).")
        return passengers
    
    def get_contact_info(self):
        while True:
            email = input("📧 Enter your email address: ").strip()
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if re.match(email_pattern, email):
                break
            else:
                print("❌ Please enter a valid email address.")
        
        while True:
            phone = input("📱 Enter your phone number (10 digits): ").strip()
            if phone.isdigit() and len(phone) == 10:
                break
            else:
                print("❌ Please enter a valid 10-digit phone number.")
        
        return email, phone
    
    def calculate_total_cost(self, destination, passenger_count):
        base_price = self.destinations[destination]["price"]
        total = base_price * passenger_count
        
        taxes = int(total * 0.12)  # 12% taxes
        convenience_fee = 200 * passenger_count
        
        return base_price, total, taxes, convenience_fee
    
    def display_booking_summary(self):
        print("\n" + "=" * 50)
        print("           📋 BOOKING SUMMARY")
        print("=" * 50)
        
        destination_info = self.destinations[self.booking_details['destination']]
        print(f"✈️  Destination: {self.booking_details['destination'].title()} ({destination_info['code']})")
        print(f"📅 Travel Date: {self.booking_details['date']}")
        print(f"👥 Passengers: {self.booking_details['passenger_count']}")
        
        print(f"\n👤 Passenger Details:")
        for i, passenger in enumerate(self.booking_details['passengers'], 1):
            print(f"   {i}. {passenger}")
        
        print(f"\n📧 Contact: {self.booking_details['email']}")
        print(f"📱 Phone: {self.booking_details['phone']}")
        
        base_price, subtotal, taxes, convenience_fee = self.booking_details['cost_breakdown']
        total_cost = subtotal + taxes + convenience_fee
        
        print(f"\n💰 Cost Breakdown:")
        print(f"   Base fare (₹{base_price} x {self.booking_details['passenger_count']}): ₹{subtotal}")
        print(f"   Taxes & Fees: ₹{taxes}")
        print(f"   Convenience Fee: ₹{convenience_fee}")
        print(f"   " + "-" * 30)
        print(f"   Total Amount: ₹{total_cost}")
        print("=" * 50)
    
    def process_payment(self):
        total_cost = sum(self.booking_details['cost_breakdown']) + self.booking_details['cost_breakdown'][1]
        
        print(f"\n💳 Total Amount to Pay: ₹{total_cost}")
        print("Payment Methods: 1) Credit Card  2) Debit Card  3) UPI")
        
        while True:
            payment_method = input("Choose payment method (1/2/3): ").strip()
            if payment_method in ['1', '2', '3']:
                break
            else:
                print("❌ Please select a valid payment method.")
        
        print("\n🔄 Processing payment...")
        import time
        for i in range(3):
            print(".", end="", flush=True)
            time.sleep(1)
        
        booking_ref = f"FL{random.randint(100000, 999999)}"
        self.booking_details['booking_reference'] = booking_ref
        
        return True
    
    def display_confirmation(self):
        print("\n" + "🎉" * 20)
        print("       BOOKING CONFIRMED! ✅")
        print("🎉" * 20)
        print(f"\n📧 Booking Reference: {self.booking_details['booking_reference']}")
        print("✅ Payment successful! Your ticket has been booked.")
        print("📧 Confirmation email sent to your registered email address.")
        print("📱 SMS confirmation sent to your phone number.")
        print("\n✈️ Have a safe and pleasant journey!")
        print("🙏 Thank you for choosing our Flight Booking System!")
        print("\n" + "=" * 50)
    
    def run_chatbot(self):
        try:
            self.display_welcome()
            
            destination = self.get_destination()
            if not destination:
                print("Invalid details. Exiting!👋 ")
                return
            
            date = self.get_travel_date()
            if not date:
                print("Invalid details. Exiting!👋")
                return
            
            passenger_count = self.get_passenger_count()
            
            passengers = self.get_passenger_details(passenger_count)
            
            email, phone = self.get_contact_info()
            
            cost_breakdown = self.calculate_total_cost(destination, passenger_count)
            
            self.booking_details = {
                'destination': destination,
                'date': date,
                'passenger_count': passenger_count,
                'passengers': passengers,
                'email': email,
                'phone': phone,
                'cost_breakdown': cost_breakdown
            }
            
            self.display_booking_summary()
            
            confirm = input("\n🤔 Confirm this booking? (yes/no): ").lower().strip()
            if confirm != "yes":
                print("❌ Booking cancelled. Goodbye! 👋")
                return
            
            payment_confirm = input("\n💳 Proceed with payment? (yes/no): ").lower().strip()
            if payment_confirm.lower() != "yes":
                print("❌ Payment cancelled. Booking not completed. 👋")
                self.log_conversation("User cancelled payment")
                return
            
            if self.process_payment():
                self.display_confirmation()
            
        except KeyboardInterrupt:
            print("\n\n⚠️ Booking process interrupted. Goodbye! 👋")
        except Exception as e:
            print(f"\n❌ An error occurred: {str(e)}")
            print("Please try again later. 🔄")

if __name__ == "__main__":
    chatbot = FlightBookingChatbot()
    chatbot.run_chatbot()