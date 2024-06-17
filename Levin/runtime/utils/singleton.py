# Levin/runtime/singleton.py

class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        # Initialization code here
        self.some_attribute = "example"

    def some_method(self):
        return f"Singleton instance method called with attribute: {self.some_attribute}"

# Example usage
if __name__ == "__main__":
    # Creating instances
    singleton1 = Singleton()
    singleton2 = Singleton()

    print(f"singleton1: {singleton1}")
    print(f"singleton2: {singleton2}")

    # They are the same instance
    print(f"Are they the same instance? {singleton1 is singleton2}")

    # Accessing method
    result = singleton1.some_method()
    print(result)
