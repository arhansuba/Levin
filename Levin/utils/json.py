import json

class OnChainJSONAgent:
    """
    OnChainJSONAgent handles JSON serialization and deserialization for on-chain data.
    """

    def __init__(self):
        pass

    def serialize_to_json(self, data):
        """
        Serialize Python data to JSON format.
        """
        try:
            return json.dumps(data)
        except Exception as e:
            raise ValueError(f"Error serializing data to JSON: {str(e)}")

    def deserialize_from_json(self, json_str):
        """
        Deserialize JSON string to Python data.
        """
        try:
            return json.loads(json_str)
        except Exception as e:
            raise ValueError(f"Error deserializing JSON string: {str(e)}")

    def interact_with_onchain_data(self, json_data):
        """
        Example function to interact with on-chain data using JSON.
        """
        try:
            # Assuming interaction with on-chain data here
            print(f"Interacting with on-chain data: {json_data}")
            # Perform actions with on-chain data
        except Exception as e:
            raise RuntimeError(f"Error interacting with on-chain data: {str(e)}")


# Example usage
if __name__ == "__main__":
    agent = OnChainJSONAgent()

    # Example data
    data = {
        "name": "Decentralized Coding Agent",
        "type": "on-chain agent",
        "description": "Handles JSON serialization and interacts with on-chain data.",
    }

    # Serialize to JSON
    json_data = agent.serialize_to_json(data)
    print("Serialized JSON:", json_data)

    # Deserialize from JSON
    deserialized_data = agent.deserialize_from_json(json_data)
    print("Deserialized data:", deserialized_data)

    # Example interaction with on-chain data
    agent.interact_with_onchain_data(json_data)
