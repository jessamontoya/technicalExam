import requests #module for fetching the URL
import csv #module for creating csv
from datetime import datetime #module for getting dates

# Fetch the response from the url
url = "https://tr148rto1k.execute-api.ap-southeast-2.amazonaws.com/dev/birthdays"
response = requests.get(url).json()

# Function to calculate age
def getAge(birthdate):
    today = datetime.now()
    birthdate = datetime.strptime(birthdate, "%Y-%m-%d")
    age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
    return age

# Calculate age for each name in the response
for name in response["body"]:
    name["age"] = getAge(name["birthday"])

# Sort the list by age
sorted_data = sorted(response["body"], key=lambda x: x["age"])

# Write the sorted age to a CSV file
with open("sorted_age.csv", mode="w", newline="") as file:
    fieldnames = ["name", "age"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)

    # Write header
    writer.writeheader()

    # Write data
    for person in sorted_data:
        writer.writerow({"name": person["name"], "age": person["age"]})

print("a csv file has been generated")