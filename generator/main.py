import json


def get_building_info():
    building = {
        "name": input("Enter building name: "),
        "photo_path": input("Enter path to building photo: "),
        "desk_number": input("Enter building desk number: "),
        "hours": input("Enter building hours: "),
        "building_description": input("Enter building description: "),
        "rooms": [],
        "employee_list": {},
    }

    # Add rooms
    while True:
        add_room = input("Do you want to add a room? (yes/no): ").strip().lower()
        if add_room != "yes":
            break
        room = {
            "name": input("Enter room name: "),
            "lead": input("Enter room lead (person): "),
            "time": input("Enter room time: "),
            "room_description": input("Enter room description: "),
            "room_number": input("Enter room number: "),
        }
        building["rooms"].append(room)

    # Add employees
    while True:
        department = input("Enter department name (or type 'done' to finish): ").strip()
        if department.lower() == "done":
            break
        building["employee_list"][department] = []
        while True:
            add_person = (
                input(f"Do you want to add a person to {department}? (yes/no): ")
                .strip()
                .lower()
            )
            if add_person != "yes":
                break
            person = {
                "name": input("Enter person name: "),
                "phone_number": input("Enter phone number: "),
                "office": input("Enter office location: "),
                "hours": input("Enter work hours: "),
            }
            building["employee_list"][department].append(person)

    return building


def main():
    data = {"buildings": []}
    try:
        with open("buildings.json", "r") as file:
            data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        pass

    while True:
        add_building = (
            input("Do you want to add a building? (yes/no): ").strip().lower()
        )
        if add_building != "yes":
            break
        data["buildings"].append(get_building_info())

    with open("buildings.json", "w") as file:
        json.dump(data, file, indent=4)

    print("Data saved to buildings.json")


if __name__ == "__main__":
    main()
