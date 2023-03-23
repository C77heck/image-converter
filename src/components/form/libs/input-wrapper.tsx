import { FieldProps } from '@/components/form/libs/abstract.dropdown';
import React, { RefObject } from 'react';

interface NormalWrapperProps extends FieldProps {
    prodRef: RefObject<any>;
    hasError: boolean;
    errorMessage: string;
    children: any;
    isInFocus: boolean;
    isOverflowHidden?: boolean;
}

export const InputWrapper = (props: NormalWrapperProps) => {
    const errorClass = `error-${props.hasError && !props.isInFocus ? 'show' : 'hide'}--div`;
    const overflowClass = `${props.isOverflowHidden ? '' : 'overflow-hidden'}`;
    const wrapperClasses = `position-center ${props?.wrapperClasses ?? 'input-wrapper'} ${errorClass} ${overflowClass} cursor-pointer`;

    return <div
        className={`display-flex flex-column ${props.className}`}
        ref={props.prodRef}
    >
        {props.label && <label
            className={`input-label error-${props.hasError && !props.isInFocus ? 'show' : 'hide'}--label ${props.labelClass}`}
            htmlFor={props.name}
        >
            {props.label}
        </label>}
        <div className={wrapperClasses}>
            {props.children}
        </div>
        {!!props.hasError && !props.isInFocus && <small className={'error-show'}>{props.errorMessage || props.errorMessage}</small>}
    </div>;
};
