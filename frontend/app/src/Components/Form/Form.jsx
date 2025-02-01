import React, { useState } from 'react';

const Form = ({ schema, onSubmit }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (path, value) => {
        setFormData(prevState => ({
            ...prevState,
            [path]: value
        }));
    };

    const renderField = (property, path) => {
        const fieldType = property.type;
        if (fieldType === 'object') {
            return (
                <div style={{ paddingLeft: '20px' }}>
                    {Object.keys(property.properties).map((key) => {
                        return (
                            <div key={key}>
                                <label>{key}:</label>
                                {renderField(property.properties[key], `${path}.${key}`)}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (fieldType === 'array') {
            return (
                <div>
                    {property.items && Array.isArray(formData[path]) && formData[path].map((_, index) => (
                        <div key={index} style={{ paddingLeft: '20px' }}>
                            {Object.keys(property.items.properties).map((key) => (
                                <div key={key}>
                                    <label>{key}:</label>
                                    {renderField(property.items.properties[key], `${path}[${index}].${key}`)}
                                </div>
                            ))}
                        </div>
                    ))}
                    <button type="button" onClick={() => handleChange(path, [...(formData[path] || []), {}])}>
                        Add Item
                    </button>
                </div>
            );
        }

        return (
            <div>
                <input
                    type="text"
                    value={formData[path] || ''}
                    onChange={(e) => handleChange(path, e.target.value)}
                />
            </div>
        );
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            {renderField(schema, '')}
            <button type="submit">Submit</button>
        </form>
    );
};

const FormWrapper = () => {
    const schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "buildings": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string" },
                        "photo_path": { "type": "string" },
                        "desk_number": { "type": "string" },
                        "hours": { "type": "string" },
                        "description": { "type": "string" },
                        "location": {
                            "type": "object",
                            "properties": {
                                "latitude": { "type": "number" },
                                "longitude": { "type": "number" }
                            },
                            "required": ["latitude", "longitude"]
                        },
                        "rooms": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": { "type": "string" },
                                    "lead": { "type": "string" },
                                    "time": { "type": "string" },
                                    "description": { "type": "string" },
                                    "room_number": { "type": "string" }
                                },
                                "required": ["name", "lead", "time", "description", "room_number"]
                            }
                        },
                        "employee_list": {
                            "type": "object",
                            "properties": {
                                "departments": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": { "type": "string" },
                                            "phone_number": { "type": "string" },
                                            "office": { "type": "string" },
                                            "hours": { "type": "string" }
                                        },
                                        "required": ["name", "phone_number", "office", "hours"]
                                    }
                                }
                            }
                        }
                    },
                    "required": ["name", "photo_path", "desk_number", "hours", "description", "location", "rooms", "employee_list"]
                }
            }
        },
        "required": ["buildings"]
    };

    const handleSubmit = (data) => {
        console.log('Form Submitted:', data);
    };

    return <Form schema={schema} onSubmit={handleSubmit} />;
};

export default FormWrapper;
