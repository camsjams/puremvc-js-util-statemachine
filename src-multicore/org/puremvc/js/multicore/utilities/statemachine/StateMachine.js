/**
 * @author Cameron Manavian
 *
 * @class org.puremvc.js.multicore.utilities.StateMachine
 *
 * PureMVC JS Utility - StateMachine
 * Copyright (c) 2014 Cameron Manavian
 * ====================================
 * Based on
 * PureMVC AS3 Utility - StateMachine
 * Copyright (c) 2008 Neil Manuell, Cliff Hall
 * Your reuse is governed by the Creative Commons Attribution 3.0 License
 */
puremvc.define({
	name: 'utilities.statemachine.StateMachine',
	parent: puremvc.Mediator,
	constructor: function () {
		console.log('StateMachine constructor()');
	}
},
// INSTANCE MEMBERS
{
	/**
	 * Map of States objects by name.
	 *
	 * @type {Object}
	 * @private
	 */
	states: {},

	/**
	 * The initial state of the FSM.
	 *
	 * @type {String}
	 * @private
	 */
	initial: null,

	/**
	 * The transition has been canceled.
	 *
	 * @type {Boolean}
	 * @private
	 */
	canceled: false,

	onRegister: function () {
		if (this.initial) {
			this.transitionTo(this,initial, null);
		}
	},

	/**
	 * Returns notification interests for the StateMachine.
	 *
	 * @return {Array}
	 * 		An array of string containing StateMachine notification interests.
	 *
	 * @override
	 */
	listNotificationInterests: function () {
		return [
		utilities.statemachine.StateMachine.ACTION,
		utilities.statemachine.StateMachine.CANCEL];
	},

	/**
	 * Handle notifications the <code>StateMachine</code> is interested in.
	 *
	 * <UL>
	 * <LI>StateMachine.ACTION: Triggers the transition to a new state.
	 * <LI>StateMachine.CANCEL: Cancels the transition if sent in response to
	 *     the exiting note for the current state.
	 *
	 * @param {Notification}
	 */
	handleNotification: function (note) {
		console.warn('StateMachine handleNotification() note:', note);
		switch (note.getName()) {
			case ACTION:
				var action = note.getType(),
					target = this.currentState.getTarget(action),
					newState = this.states[target];
				if (newState) {
					this.transitionTo(newState, note.getBody());
				}
				break;

			case CANCEL:
				this.canceled = true;
				break;
		}
	},

	/**
	 * Registers the entry and exit commands for a given state.
	 *
	 * @param {State} state
	 * 		The state to which to register the above commands.
	 *
	 * @param {Boolean} initial
	 * 		Boolean telling if this is the initial state of the system.
	 */
	registerState: function (state, initial) {
		console.log('StateMachine registerState() stateName:', stateName);
		if (state == null || this.states[state.name] != null) {
			return;
		}
		this.states[state.name] = state;
		if (initial) {
			this.initial = state;
		}
	},

	/**
	 * Remove a state mapping.
	 *
	 * <P>
	 * Removes the entry and exit commands for a given state
	 * as well as the state mapping itself.
	 *
	 * @param {String} stateName
	 * 		Name of the state mapping to remove.
	 */
	removeState: function (stateName) {
		console.log('StateMachine removeState() stateName:', stateName);
		var state = this.states[stateName];
		if (state == null) {
			return;
		}
		this.states[stateName] = null;
	},

	/**
	 * Transitions to the given state from the current state.
	 *
	 * <P>
	 * Sends the <code>exiting</code> notification for the current state
	 * followed by the <code>entering</code> notification for the new state.
	 * Once finally transitioned to the new state, the <code>changed</code>
	 * notification for the new state is sent.
	 *
	 * <P>
	 * If a data parameter is provided, it is included as the body of all
	 * three state-specific transition notes.
	 *
	 * <P>
	 * Finally, when all the state-specific transition notes have been
	 * sent, a <code>StateMachine.CHANGED</code> note is sent, with the
	 * new <code>State</code> object as the <code>body</code> and the name of the
	 * new state in the <code>type</code>.
	 *
	 * @param {State} nextState
	 * 		The next State to transition to.
	 *
	 * @param {Object} data
	 * 		Optional object that was sent in the <code>StateMachine.ACTION</code>
	 * 		notification body.
	 */
	transitionTo: function (nextState, data) {
		console.log('StateMachine transitionTo()', nextState, data);
		// Going nowhere?
		if (nextState == null) {
			return;
		}

		// Clear the cancel flag
		this.canceled = false;

		// Exit the current State
		if (this.getCurrentState && this.getCurrentState.exiting) {
			this.sendNotification(this.getCurrentState.exiting, data, nextState.name);
		}

		// Check to see whether the exiting guard has canceled the transition
		if (canceled) {
			this.canceled = false;
			return;
		}

		// Enter the next State
		if (nextState.entering) {
			this.sendNotification(nextState.entering, data);
		}

		// Check to see whether the entering guard has canceled the transition
		if (canceled) {
			this.canceled = false;
			return;
		}

		// change the current state only when both guards have been passed
		this.setCurrentState = nextState;

		// Send the notification configured to be sent when this specific state becomes current
		if (nextState.changed) {
			this.sendNotification(this.getCurrentState.changed, data);
		}

		// Notify the app generally that the state changed and what the new state is
		this.sendNotification(StateMachine.CHANGED, this.getCurrentState, this.getCurrentState.name);
	},

	/**
	 * Get the current state.
	 *
	 * @return {State}
	 * 		A State defining the machine's current state
	 */
	getCurrentState: function () {
		return this.viewComponent;
	},

	/**
	 * Set the current state.
	 *
	 * @param {State} state
	 * 		The <code>State</code> object defining the machine's current
	 * 		state.
	 */
	setCurrentState: function (state) {
		this.viewComponent = state;
	},
},
// STATIC MEMBERS
{
	NAME: 'StateMachine',
	/**
	 * Action Notification name.
	 */
	ACTION: "/notes/action",

	/**
	 *  Changed Notification name
	 */
	CHANGED: "/notes/changed",

	/**
	 *  Cancel Notification name
	 */
	CANCEL: "/notes/cancel"
});