import React, { createContext, useEffect, useRef } from "react";
import Cookies from 'universal-cookie'

export function useEffectOnce(effect: React.EffectCallback) {
	let ref = useRef(true);

	useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return effect();
		}
	}, []);
}

export class MyCookies extends Cookies {
	setFromObj: Function = (obj: any, path: string | undefined) => {
		for (var key in obj) {
			this.set(key, obj[key], path ? { path } : undefined)
		}
	};
	constructor() {
		super()
	}
}

export const cookies = new MyCookies();

export const globalContext = createContext({loggedIn: false, setLoggedIn: (val: boolean) => {}});

export function ShowConditionally(props: any) {
	let children = props.children;
	let one, two;

	one = <></>;
	two = <></>;
	if (Array.isArray(children)) {
		if (children[0])
			one = children[0];
		if (children[1])
			two = children[1];
	}
	else if (children) {
		one = children;
	}
	return (
		<>
			{
				props.cond ? one : two
			}
		</>
	);
}