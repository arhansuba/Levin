from dataclasses import dataclass

from Levin.events.event import Event


@dataclass
class Observation(Event):
    content: str
