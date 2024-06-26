import {
  EventInterface,
  EventHandlerInterface,
  Class,
  BoosterConfig,
  NotificationInterface,
} from '@boostercloud/framework-types'
import { Booster } from '../booster'

export function EventHandler<TEvent extends EventInterface | NotificationInterface>(
  event: Class<TEvent>
): <TEventHandler extends EventHandlerInterface>(eventHandlerClass: TEventHandler) => void {
  return (eventHandlerClass) => registerEventHandler(event.name, eventHandlerClass)
}

export function registerEventHandler<TEventHandler extends EventHandlerInterface>(
  eventName: string,
  eventHandlerClass: TEventHandler
): void {
  Booster.configureCurrentEnv((config: BoosterConfig): void => {
    const registeredEventHandlers = config.eventHandlers[eventName] || []
    if (registeredEventHandlers.some((klass: EventHandlerInterface) => klass == eventHandlerClass)) {
      return
    }
    registeredEventHandlers.push(eventHandlerClass)
    config.eventHandlers[eventName] = registeredEventHandlers
  })
}
