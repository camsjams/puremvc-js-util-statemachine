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
		console.log('FSMInjector constructor() fsm:', fsm);
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
		console.warn('FSMInjector inject()');
		var stateMachine = new utilities.statemachine.StateMachine(),
			state;
		console.warn('FSMInjector inject() stateMachine', stateMachine);

		console.log('FSMInjector inject() this.states', this.states());
		// Register all the states with the StateMachine
		for (state in this.states()) {
			console.log('FSMInjector inject() state', state);
			stateMachine.registerState(state, this.isInitial(state.name));
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
		console.log('states()');
		var stateDefs = this.fsm.state,
			state;

		if (this.stateList === null) {
			this.stateList = [];
			for (var i = 0; i < stateDefs.length; i++) {
				this.stateList.push(
				this.createState(stateDefs[i]));
			}
		}
		console.log('states() has stateList', this.stateList);
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

		console.warn('createState() state', state);
		console.warn('createState() transitions', transitions);
		/*
		// set transitions
		for (var i = 0, len = transitions.length(); i < len; i++) {
			var transDef = transitions[i];
			state.defineTrans(String(transDef.@action), String(transDef.@target));
		}*/
		console.warn('finish: createState', stateDef);
		//return state;
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
		var initial = true;
		//var initial /*String*/ = XML(fsm.@initial).toString();
		console.warn('isInitial', initial, stateName);
		return stateName === initial;
	}
});