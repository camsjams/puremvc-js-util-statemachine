/**
 * @author Cameron Manavian
 *
 * @class org.puremvc.js.multicore.utilities.statemachine.State
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
	name: 'utilities.statemachine.State',
	parent: puremvc.Notifier,
	constructor: function (name, entering, exiting, changed) {
		this.name = name;
		this.onInit();
		if (entering) this.entering = entering;
		if (exiting) this.exiting = exiting;
		if (changed) this.changed = changed;
	}
},
// INSTANCE MEMBERS
{
	/**
	 * The state name.
	 *
	 * @type {String}
	 */
	name: null,

	/**
	 * The notification to dispatch when entering the state.
	 *
	 * @type {String}
	 */
	entering: null,

	/**
	 * The notification to dispatch when exiting the state.
	 *
	 * @type {String}
	 */
	exiting: null,

	/**
	 * The notification to dispatch when the state has actually changed.
	 *
	 * @type {String}
	 */
	changed: null,

	/**
	 *  Transition map of actions to target states.
	 *
	 *  @type {Object}
	 */
	transitions: {},

	/**
	 * Define a transition.
	 *
	 * @param {String} action
	 *		 The name of the <code>StateMachine.ACTION</code> Notification type.
	 *
	 * @param {String} target
	 *		 The name of the target state to transition to.
	 */
	defineTrans: function (action, target) {
		if (this.getTarget(action)){
			return;
		}
		this.transitions[action] = target;
	},

	/**
	 * Remove a previously defined transition.
	 *
	 * @type {String} action
	 *		 Name of the action to remove.
	 */
	removeTrans: function (action) {
		this.transitions[action] = null;
	},

	/**
	 * Get the target state name for a given action.
	 *
	 * @return {String}
	 *		 The target state name for a given action.
	 */
	getTarget: function (action) {
		return this.transitions[action];
	},
	
	/**
	 * init instance vars
	 *
	 */
	onInit: function() {
		this.entering = null;
		this.exiting = null;
		this.changed = null;
		this.transitions = {};
	}
});

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
	parent: puremvc.Mediator
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
	 * @type {State}
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
			this.transitionTo(this.initial, null);
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
		switch (note.getName()) {
			case utilities.statemachine.StateMachine.ACTION:
				var action = note.getType(),
					target = this.getCurrentState() ? this.getCurrentState().getTarget(action) : false,
					newState = target ? this.states[target] : false;
				if (newState) {
					this.transitionTo(newState, note.getBody());
				}
				break;

			case utilities.statemachine.StateMachine.CANCEL:
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
		if (state === null || this.states[state.name]) {
			return;
		}
		this.states[state.name] = state;
		if (initial) {
			this.initial = state;
			this.setCurrentState(state);
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
		var state = this.states[stateName];
		if (state === null) {
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
		// Going nowhere?
		if (nextState === null) {
			return;
		}

		// Clear the cancel flag
		this.canceled = false;
		
		// Exit the current State
		if (this.getCurrentState() && this.getCurrentState().exiting) {
			this.sendNotification(this.getCurrentState().exiting, data, nextState.name);
		}

		// Check to see whether the exiting guard has canceled the transition
		if (this.canceled) {
			this.canceled = false;
			return;
		}

		// Enter the next State
		if (nextState.entering) {
			this.sendNotification(nextState.entering, data);
		}

		// Check to see whether the entering guard has canceled the transition
		if (this.canceled) {
			this.canceled = false;
			return;
		}

		// change the current state only when both guards have been passed
		this.setCurrentState(nextState);

		// Send the notification configured to be sent when this specific state becomes current
		if (nextState.changed) {
			this.sendNotification(this.getCurrentState().changed, data);
		}

		// Notify the app generally that the state changed and what the new state is
		this.sendNotification(utilities.statemachine.StateMachine.CHANGED, this.getCurrentState(), this.getCurrentState.name);
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

/**
 * @author Cameron Manavian
 *
 * @class org.puremvc.js.multicore.utilities.statemachine.FSMInjector
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
	name: 'utilities.statemachine.FSMInjector',
	parent: puremvc.Notifier,
	constructor: function (fsm) {
		this.fsm = fsm;
	}
},
// INSTANCE MEMBERS
{
	/**
	 * The json FSM definition.
	 *
	 * @type {Object}
	 * @private
	 */
	fsm: {},

	/**
	 * The list of State objects.
	 *
	 * @type {Array}
	 * @private
	 */
	stateList: null,
	/**
	 * Inject the <code>StateMachine</code> into the PureMVC apparatus.
	 *
	 * <P>
	 * Creates the <code>StateMachine</code> instance, registers all the
	 * states and registers the <code>StateMachine</code> with the
	 * <code>IFacade</code>.
	 */
	inject: function () {
		var stateMachine = new utilities.statemachine.StateMachine(),
			states = this.states();
		// TODO investigate this bug
		// reset objects that bleed
		stateMachine.states = {};
		stateMachine.initial = null;
		//console.log('FSMInjector inject() fsm:%o and states:%o', this.fsm, states);
		// Register all the states with the StateMachine
		for (var i = 0; i < states.length; i++) {
			stateMachine.registerState(states[i], this.isInitial(states[i].name));
		}
		// Register the StateMachine with the facade
		this.facade.registerMediator(stateMachine);
	},

	/**
	 * Get the state definitions.
	 *
	 * <P>
	 * Creates and returns the array of State objects
	 * from the FSM on first call, subsequently returns
	 * the existing array.
	 *
	 * @return {Array}
	 * 		A list of State objects.
	 *
	 * @private
	 */
	states: function () {
		var stateDefs = this.fsm.state;

		if (this.stateList === null) {
			this.stateList = [];
			for (var i = 0; i < stateDefs.length; i++) {
				this.stateList.push(this.createState(stateDefs[i]));
			}
		}
		return this.stateList;
	},

	/**
	 * Creates a <code>State</code> instance from its JSON definition.
	 *
	 * @param {Object} stateDef
	 * 		The definition of the state to create.
	 *
	 * @return {State}
	 * 		The created <code>State</code> instance.
	 */
	createState: function (stateDef) {
		// Create State object
		var state = new utilities.statemachine.State(stateDef['@name'], stateDef['@entering'], stateDef['@exiting'], stateDef['@changed']),
			transitions = stateDef.transition;
		if(transitions) {
			// set transitions
			for (var i = 0; i < transitions.length; i++) {
				state.defineTrans(
					transitions[i]['@action'],
					transitions[i]['@target']
				);
			}
		}
		return state;
	},

	/**
	 * Is the given state the initial state?
	 *
	 * @param {String} stateName
	 * 		Name of the state to know if it's the initial state.
	 *
	 * @return {Boolean}
	 * 		The given state is the initial state.
	 *
	 */
	isInitial: function (stateName) {
		return stateName === this.fsm['@initial'];
	}
});