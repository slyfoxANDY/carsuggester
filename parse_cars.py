import csv
import json
import re

# Read CSV
cars = []
car_id = 1

with open('cars_data.csv', 'r', encoding='latin-1') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            # Extract horsepower as integer
            hp = int(re.search(r'\d+', str(row['HorsePower'])).group()) if row['HorsePower'] else 0
            
            # Extract torque as integer
            torque = re.search(r'\d+', str(row['Torque'])).group() if row['Torque'] else '0'
            
            # Extract price (remove currency symbols and commas)
            price = str(row['Cars Prices']).strip()
            
            # Extract acceleration (0-100 km/h)
            accel = float(re.search(r'[\d.]+', str(row['Performance(0 - 100 )KM/H'])).group()) if row['Performance(0 - 100 )KM/H'] else 5.0
            
            # Extract top speed
            top_speed = int(re.search(r'\d+', str(row['Total Speed'])).group()) if row['Total Speed'] else 200
            
            # Extract engine displacement
            engine_cc = str(row['CC/Battery Capacity']).strip()
            
            # Extract seats
            seats = int(re.search(r'\d+', str(row['Seats'])).group()) if row['Seats'] else 5
            
            car = {
                'id': car_id,
                'brand': str(row['Company Names']).strip(),
                'name': str(row['Cars Names']).strip(),
                'category': 'Luxury' if int(hp) > 500 else 'Sports' if int(hp) > 400 else 'Performance' if int(hp) > 300 else 'Executive',
                'year': 2024,
                'price': price,
                'fuelType': str(row['Fuel Types']).strip(),
                'description': f"{row['Company Names'].strip()} {row['Cars Names'].strip()} with {hp} HP",
                'engineType': str(row['Engines']).strip(),
                'displacement': engine_cc,
                'horsepower': hp,
                'torque': f"{torque} Nm",
                'transmission': 'Automatic',
                'fuelEconomy': '8-12 MPG',
                'acceleration': accel,
                'topSpeed': top_speed,
                'handling': min(95, int(hp / 10)),
                'comfort': 85 if seats >= 4 else 70,
                'seating': seats,
                'cargo': '350 liters',
                'features': 'Premium Audio, Navigation, Climate Control',
                'technology': 'Apple CarPlay, Android Auto, Backup Camera',
                'rating': min(5.0, 3.5 + (hp / 500)),
                'pros': [
                    f'Powerful {hp} HP engine',
                    f'Top speed of {top_speed} km/h',
                    'Premium interior quality',
                    'Advanced technology features',
                    'Excellent acceleration',
                    'Luxurious design'
                ],
                'cons': [
                    'High fuel consumption',
                    'Expensive maintenance',
                    'Limited cargo space',
                    'Premium price tag',
                    'Not ideal for daily commuting',
                    'High insurance costs'
                ]
            }
            cars.append(car)
            car_id += 1
            
        except Exception as e:
            print(f"Error processing row: {row}")
            continue

print(f"Processed {len(cars)} cars")

# Write to data.js
with open('data.js', 'w', encoding='utf-8') as f:
    f.write('// Car Database - Generated from Cars Datasets 2025.csv\n')
    f.write('// Contains ' + str(len(cars)) + ' luxury and performance vehicles\n\n')
    f.write('const cars = ' + json.dumps(cars, indent=4) + ';\n\n')
    
    # Write quiz questions
    f.write('''// Quiz System - 5 Questions with Category Scoring
const quizQuestions = [
    {
        question: "What's your primary use for a car?",
        options: [
            { text: "Daily commuting", score: { economical: 5, practical: 5, comfort: 3, sporty: 0 } },
            { text: "Weekend adventures", score: { economical: 2, practical: 3, comfort: 2, sporty: 5 } },
            { text: "Luxury & comfort", score: { economical: 0, practical: 2, comfort: 5, sporty: 1 } },
            { text: "Track performance", score: { economical: 0, practical: 0, comfort: 0, sporty: 5 } }
        ]
    },
    {
        question: "What's your budget range?",
        options: [
            { text: "Under $50,000", score: { economical: 5, practical: 5, comfort: 2, sporty: 1 } },
            { text: "$50K - $150K", score: { economical: 2, practical: 3, comfort: 4, sporty: 3 } },
            { text: "$150K - $300K", score: { economical: 0, practical: 1, comfort: 5, sporty: 4 } },
            { text: "Over $300K", score: { economical: 0, practical: 0, comfort: 5, sporty: 5 } }
        ]
    },
    {
        question: "How important is fuel efficiency?",
        options: [
            { text: "Very important", score: { economical: 5, practical: 4, comfort: 2, sporty: 0 } },
            { text: "Somewhat important", score: { economical: 3, practical: 3, comfort: 3, sporty: 2 } },
            { text: "Not important", score: { economical: 0, practical: 1, comfort: 3, sporty: 4 } },
            { text: "I want maximum power", score: { economical: 0, practical: 0, comfort: 1, sporty: 5 } }
        ]
    },
    {
        question: "Preferred driving experience?",
        options: [
            { text: "Smooth & relaxing", score: { economical: 2, practical: 2, comfort: 5, sporty: 0 } },
            { text: "Balanced", score: { economical: 3, practical: 4, comfort: 3, sporty: 2 } },
            { text: "Sportive & engaging", score: { economical: 0, practical: 1, comfort: 2, sporty: 5 } },
            { text: "Pure adrenaline rush", score: { economical: 0, practical: 0, comfort: 0, sporty: 5 } }
        ]
    },
    {
        question: "What matters most to you?",
        options: [
            { text: "Cost efficiency", score: { economical: 5, practical: 3, comfort: 1, sporty: 0 } },
            { text: "Practicality & space", score: { economical: 1, practical: 5, comfort: 3, sporty: 0 } },
            { text: "Luxury & comfort", score: { economical: 0, practical: 1, comfort: 5, sporty: 1 } },
            { text: "Speed & performance", score: { economical: 0, practical: 0, comfort: 0, sporty: 5 } }
        ]
    }
];

// Quiz Result Categories
const carCategories = {
    economical: cars.filter(c => c.horsepower < 200).map(c => c.id),
    practical: cars.filter(c => c.seating >= 5 && c.horsepower < 400).map(c => c.id),
    comfort: cars.filter(c => c.comfort >= 85).map(c => c.id),
    sporty: cars.filter(c => c.horsepower >= 500).map(c => c.id)
};
''')

print("✅ Generated new data.js with all cars!")
