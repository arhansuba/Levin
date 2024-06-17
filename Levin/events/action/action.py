from dataclasses import dataclass
from typing import ClassVar

from Levin.events.event import Event


@dataclass
class Action(Event):
    runnable: ClassVar[bool] = False
