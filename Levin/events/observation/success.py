from dataclasses import dataclass

from Levin.core.schema import ObservationType

from .observation import Observation


@dataclass
class SuccessObservation(Observation):
    """
    This data class represents the result of a successful action.
    """

    observation: str = ObservationType.SUCCESS

    @property
    def message(self) -> str:
        return self.content
