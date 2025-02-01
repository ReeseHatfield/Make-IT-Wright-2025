import json
import tkinter as tk
from tkinter import filedialog, messagebox, simpledialog


def get_building_info():
    building = {
        "name": simpledialog.askstring("Input", "Enter building name:"),
        "photo_path": filedialog.askopenfilename(title="Select building photo"),
        "desk_number": simpledialog.askstring("Input", "Enter building desk number:"),
        "hours": simpledialog.askstring("Input", "Enter building hours:"),
        "description": simpledialog.askstring("Input", "Enter building description:"),
        "rooms": [],
        "employee_list": {},
    }

    # Add rooms
    while messagebox.askyesno("Add Room", "Do you want to add a room?"):
        room = {
            "name": simpledialog.askstring("Input", "Enter room name:"),
            "lead": simpledialog.askstring("Input", "Enter room lead (person):"),
            "time": simpledialog.askstring("Input", "Enter room time:"),
            "description": simpledialog.askstring("Input", "Enter room description:"),
            "room_number": simpledialog.askstring("Input", "Enter room number:"),
        }
        building["rooms"].append(room)

    # Add employees
    while True:
        department = simpledialog.askstring(
            "Input", "Enter department name (or type 'done' to finish):"
        )
        if not department or department.lower() == "done":
            break
        building["employee_list"][department] = []
        while messagebox.askyesno(
            "Add Employee", f"Do you want to add a person to {department}?"
        ):
            person = {
                "name": simpledialog.askstring("Input", "Enter person name:"),
                "phone_number": simpledialog.askstring("Input", "Enter phone number:"),
                "office": simpledialog.askstring("Input", "Enter office location:"),
                "hours": simpledialog.askstring("Input", "Enter work hours:"),
            }
            building["employee_list"][department].append(person)

    return building


def save_data(data):
    with open("buildings.json", "w") as file:
        json.dump(data, file, indent=4)


def load_data():
    try:
        with open("buildings.json", "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"buildings": []}


def add_building():
    data = load_data()
    data["buildings"].append(get_building_info())
    save_data(data)
    messagebox.showinfo("Success", "Building added successfully!")


def main():
    root = tk.Tk()
    root.title("Building Manager")
    root.geometry("300x200")

    add_button = tk.Button(root, text="Add Building", command=add_building)
    add_button.pack(pady=20)

    exit_button = tk.Button(root, text="Exit", command=root.quit)
    exit_button.pack(pady=10)

    root.mainloop()


if __name__ == "__main__":
    main()
