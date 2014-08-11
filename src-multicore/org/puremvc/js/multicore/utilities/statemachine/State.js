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