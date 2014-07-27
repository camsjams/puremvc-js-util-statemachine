## PureMVC JavaScript Utility: State Machine

Much like the official [PureMVC](http://puremvc.github.com/) [ActionScript 3](https://github.com/PureMVC/puremvc-as3-standard-framework/wiki) [Utility: State Machine](https://github.com/PureMVC/puremvc-as3-util-statemachine/wiki), this utility provides a simple yet effective Finite State Machine implementation, which allows the definition of discrete states, and the valid transitions to other states available from any given state, and the actions which trigger the transitions. A mechanism is provided for defining the entire state machine in XML-friendly JSON and having a fully populated StateMachine injected into the PureMVC app.

* Discussion - coming soon
* [State Machine Overview Presentation](http://puremvc.tv/#P003/)

## API Docs (refer to official AS3 docs for now)
* [MultiCore Version](http://darkstar.puremvc.org/content_header.html?url=http://puremvc.org/pages/docs/AS3/Utility_AS3_StateMachine/asdoc-multicore/&desc=PureMVC%20MultiCore%20Docs%20AS3%20Utility:%20State%20Machine)

## Status
Production - Version 1.0.0

## Demos Using This Utility
* [Locks](https://github.com/camsjams/puremvc-js-util-statemachine-demo-locks/wiki)

## Platforms / Technologies
* [JavaScript](http://en.wikipedia.org/wiki/JavaScript)

## State Representation
* The States held and navigated by the StateMachine are instances of a State class, which carries several critical pieces of information about that State. Each State has optional associated Notifications to be sent on entry into the State and exit from the State. 
* The exiting notification carries a reference in the body to the State that we are transitioning to. This helps actors respond properly by anticipating the destination state. 
* The entering notification for a State carries a reference in the body to the state we are entering as well, in case you've sub-classed State to pass data.    
* It is up to the programmer to define and register commands or mediators with interest in these entering and exiting notifications, the state machine simply sends them at the appropriate times.
* The State class also exposes methods for defining and removing transitions. A transition simply maps an action name to a target State name. 
    
## State Transitions
* The transition from one state to the next is triggered by any actor sending a StateMachine.ACTION Notification. Include the name of the action in the Notification's type parameter.   
* Actions are what trigger the StateMachine to initiate the transition from the one State to the next. There is no formal Action class at this time, it is merely a name that will trigger a State transition.
* It is up to the application to ensure any special conditions for making the transition are met before sending the StateMachine.ACTION Notification, which will initiate the transition immediately if one is defined for the input action given the current State.  
* Any actor responding to the Notification sent when exiting a state may send a StateMachine.CANCEL notification, which will cause the StateMachine not to enter the next State.  The programmer  must insure that no other responses to the current State's exit notification need to be rolled back. This is best done by checking any items that could lead to a StateMachine.CANCEL being sent before initiating any exit activity such as visual transitions or form clearing/population, thus avoiding the need to rollback to restore the application to the state being exited.  
* Finally, when a transition is complete, the StateMachine sends a StateMachine.CHANGED Notification, with a reference to the new State. This is sent once any exiting notification for the previous state, as well as any entering notification for the new state have both been executed, and the current state of the StateMachine has been updated to the new state.
     
## FSM Injector
 * Also included in this release is a useful class that allows you to define your FSM in a JSON format, and pass it to the FSMInjector where it will be parsed, and a fully populated StateMachine instance will be created and registered via your Facade. 
* The FSMInjector extends Notifier to give it a reference to the Facade for injecting the completed StateMachine.
* You are free to load the JSON statemachine via an ajax request, page variable, or within a PureMVC command itself.
* The JSON format for the FSM Injector is simple, and inspired by the existing XML format (mostly to ease context switch from AS3 to JS). For instance here is the FSM for a door:

>  		var fsm = {
>  			"@initial": "CLOSED",
>  			"state": [
>  				{
>  					"@name": "OPENED",
>  					"@entering": "openingNote",
>  					"@exiting": "aboutToCloseNote",
>  					"transition": [
>  						{
>  							"@action": "CLOSE",
>  							"@target": "CLOSED"
>  						}
>  					]
>  				},
>  				{
>  					"@name": "CLOSED",
>  					"@entering": "closingNote",
>  					"transition": [
>  						{
>  							"@action": "OPEN",
>  							"@target": "OPENED"
>  						},
>  						{
>  							"@action": "LOCK",
>  							"@target": "UNLOCKED"
>  						}
>  					]
>  				},
>  				{
>  					"@name": "LOCKED",
>  					"@entering": "lockingNote",
>  					"transition": [
>  						{
>  							"@action": "UNLOCK",
>  							"@target": "CLOSED"
>  						}
>  					]
>  				}
>  			]
>  		};

* The above FSM defines three discrete states OPENED, CLOSED and LOCKED. 
* The actions OPEN, CLOSE and LOCK are used to trigger state transitions. 
* It is only possible to LOCK the door when it is CLOSED, because only the CLOSED state defines a transition targeting the LOCKED state.
* It is not possible to OPEN the door from the LOCKED state because no transition is defined targeting the OPEN state. 
* And when you UNLOCK the door, it returns to the CLOSED state, where it is once again possible to OPEN or LOCK.
* An exiting notification is defined only for exiting the OPEN state to illustrate that entering and exiting notifications are optional.

## License
* PureMVC JavaScript Utility: State Machine (Ported) - Copyright © 2014-2020 Cameron Manavian
* PureMVC - Copyright © 2006-2012 Futurescale, Inc.
* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
  * Neither the name of Futurescale, Inc., PureMVC.org, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.