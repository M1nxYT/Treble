import { ready } from './ready';
import { messageCreate } from './messageCreate';
import { interactionCreate } from './interactionCreate';

export let events = [
    ready,
    messageCreate,
    interactionCreate
]