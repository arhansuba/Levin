from Levin.events.observation.agent import AgentStateChangedObservation
from Levin.events.observation.browse import BrowserOutputObservation
from Levin.events.observation.commands import (
    CmdOutputObservation,
    IPythonRunCellObservation,
)
from Levin.events.observation.delegate import AgentDelegateObservation
from Levin.events.observation.empty import NullObservation
from Levin.events.observation.error import ErrorObservation
from Levin.events.observation.files import FileReadObservation, FileWriteObservation
from Levin.events.observation.observation import Observation
from Levin.events.observation.recall import AgentRecallObservation
from Levin.events.observation.success import SuccessObservation


observations = (
    NullObservation,
    CmdOutputObservation,
    IPythonRunCellObservation,
    BrowserOutputObservation,
    FileReadObservation,
    FileWriteObservation,
    AgentRecallObservation,
    AgentDelegateObservation,
    SuccessObservation,
    ErrorObservation,
    AgentStateChangedObservation,
)

OBSERVATION_TYPE_TO_CLASS = {
    observation_class.observation: observation_class  # type: ignore[attr-defined]
    for observation_class in observations
}


def observation_from_dict(observation: dict) -> Observation:
    observation = observation.copy()
    if 'observation' not in observation:
        raise KeyError(f"'observation' key is not found in {observation=}")
    observation_class = OBSERVATION_TYPE_TO_CLASS.get(observation['observation'])
    if observation_class is None:
        raise KeyError(
            f"'{observation['observation']=}' is not defined. Available observations: {OBSERVATION_TYPE_TO_CLASS.keys()}"
        )
    observation.pop('observation')
    observation.pop('message', None)
    content = observation.pop('content', '')
    extras = observation.pop('extras', {})
    return observation_class(content=content, **extras)
