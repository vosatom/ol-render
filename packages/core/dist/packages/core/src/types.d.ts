import React from 'react';
import { Catalogue } from './catalogue';
import { Events } from './events';
export declare namespace ReactOlFiber {
    type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;
    /**
     * Get keys whose fields are writable in a class (not readonly)
     */
    type WritableKeys<T> = {
        [P in keyof T]-?: IfEquals<{
            [Q in P]: T[P];
        }, {
            -readonly [Q in P]: T[P];
        }, P>;
    }[keyof T];
    /**
     * Get keys whose fields are functions in a class
     */
    type FunctionKeys<T> = {
        [K in keyof T]: T[K] extends Function ? K : never;
    }[keyof T];
    /**
     * Get keys whose fields are classes in a class
     */
    type ClassKeys<T> = {
        [K in keyof T]: T[K] extends new (...args: any) => any ? K : never;
    }[keyof T];
    /**
     * Get keys whose fields are ol object catalog elements class with a single option arg in constructor
     */
    type OlObjectCatalogElementKeys<T> = {
        [K in keyof T]: T[K] extends {
            object: new (arg: any, arg2: void) => any;
        } ? K : never;
    }[keyof T];
    type PickWritables<T> = Pick<T, WritableKeys<T>>;
    type OmitWritables<T> = Omit<T, WritableKeys<T>>;
    type PickFunctions<T> = Pick<T, FunctionKeys<T>>;
    type OmitFunctions<T> = Omit<T, FunctionKeys<T>>;
    type PickClasses<T> = Pick<T, ClassKeys<T>>;
    type OmitClasses<T> = Omit<T, ClassKeys<T>>;
    type SimpleObjectKeys<T> = Pick<T, OlObjectCatalogElementKeys<T>>;
    type ComplexObjectKeys<T> = Omit<T, OlObjectCatalogElementKeys<T>>;
    /**
     * Generic elements based on simple ol objects (most usual case)
     */
    type IntrinsicElementsSimpleObject = {
        [T in keyof SimpleObjectKeys<Catalogue>]: Partial<OmitFunctions<PickWritables<Catalogue[T]['object']>>> & Partial<ConstructorParameters<Catalogue[T]['object']>[0]> & {
            attach?: string | (<Container = any, Child = any>(container: Container, child: Child) => (container: Container, child: Child) => void);
            attachArray?: string;
            onUpdate?: (...args: any[]) => void;
            children?: React.ReactNode | React.ReactNodeArray;
            ref?: React.Ref<React.ReactNode>;
            key?: React.Key;
            args?: ConstructorParameters<Catalogue[T]['object']> | ConstructorParameters<Catalogue[T]['object']>[0];
        } & Events & {
            [key: string]: any;
        };
    };
    /**
     * Generic elements based on more complex constructors
     */
    type IntrinsicElementsArgsObject = {
        [T in keyof ComplexObjectKeys<Catalogue>]: Partial<OmitFunctions<PickWritables<Catalogue[T]['object']>>> & {
            attach?: string | (<Container = any, Child = any>(container: Container, child: Child) => (container: Container, child: Child) => void);
            attachArray?: string;
            onUpdate?: (...args: any[]) => void;
            children?: React.ReactNode | React.ReactNodeArray;
            ref?: React.Ref<React.ReactNode>;
            key?: React.Key;
            constructFrom?: keyof Catalogue[T]['object'];
            args?: any;
        } & Events & {
            [key: string]: any;
        };
    };
    /**
     * Specific ad-hoc elements
     */
    type IntrinsicElementsAdHoc = {
        olPrimitive: {
            object: any;
        } & {
            [properties: string]: any;
        };
        olNew: {
            object: any;
            args: any[];
        } & {
            [properties: string]: any;
        };
    };
    type IntrinsicElements = ReactOlFiber.IntrinsicElementsAdHoc & ReactOlFiber.IntrinsicElementsSimpleObject & ReactOlFiber.IntrinsicElementsArgsObject;
}
declare global {
    namespace JSX {
        interface IntrinsicElements extends ReactOlFiber.IntrinsicElements {
        }
    }
}
export type OlObject = any;
