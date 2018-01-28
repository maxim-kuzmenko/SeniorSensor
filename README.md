## The Concept
Senior Sensor is a notification device that let's you or a caretaker know the status an elderly individual with the use of SMS notifications. The sensor will be located on the wrist of the individual in care and detect any sudden movements or sound coming from the individual. In the case where these actions may be harmful or possess danger to the senior, you or their caretaker will be notified by text and given a quick report of the severity or situation. 

## How it works
Currently, the Senior Sensor as proof of concept will send two types of SMS notifications to a caretaker depending on movement by the elderly individual.

Case 1: "Sudden Fall Detected for our Elderly patient."
In this situation, if the device experiences a sudden drop in height over the course of a few seconds and . It is likely our elderly individual has fallen off their bed, or while walking around. The elderly are more susceptible to falling due to decline in physical fitness, and various other complications that arise from old age. Falling down can also life threatening for the elderly, and if such an incident occurs then the caretaker would need to respond immediately.

Case 2: "Our elderly patient is on the move."
Certain elderly individuals may need to remain in bed unless supervised by a caretaker and if they were to leave unsupervised they can cause great harm to themselves. These situations can arise if a patient has a condition such as dementia or a condition where they may try to roam around when they need to stay in bed. Notifying the caretaker immediately is key to prevent harm from coming to the elderly individual.

Case 3 (potential future case): "Our elderly patient has not moved significantly for the past x hours"
There is also the case where our elderly individual will need to move around after prolonged periods of inactivity for conditions that may require a small amount of healthy exercise. This notification will remind the caretaker to check up on the elderly when necessary.  

## Technical Details
To detect movement, we utilize the accelerator to give us acceleration in the x, y and z axis. However we run into the challenge that without a gyroscope, it is extremely difficult to determine the true axis because if the device is strapped to one's wrist, it will never be in the same orientation at all times. Therefore, we average out the acceleration vectors to get the general magnitude of acceleration, which we can compare with the acceleration of gravity (for falls). To recognize that the individual is falling, rather than simply walking, we keep track of acceleration for around 5 seconds and check for consistency in acceleration. To differentiate cases where it is ambiguous if the individual is either moving or has fallen (such as walking and coming to a halt vs walking and falling), the sound sensor will be used to verify these situations by checking for a considerably loud noise in these situations.

## How it helps
As a finished product, Senior Sensor should provide a sense of security and assurance for those who need to take care of elderly family members by giving them the certainty that if something were to happen to their loved one, they would be notified as soon as possible. For those who work as a caretaker for multiple senior individuals, Senior sensor can help them track the status of many individuals at once without being by their side all the time or by invading their personal privacy.
