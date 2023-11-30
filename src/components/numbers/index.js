import InputNumbers from './numbers';

export function SortNumbers(props) {
    return (
        <div className="sortNumbers">
            <InputNumbers {...props} />
            {props.children}
        </div>
    );
}

export function Numbox({ index, value, ...rest }) {
    return (
        <div className="numbox" id={`box${index}`} {...rest}>
            {value}
        </div>
    );
}

export function Node({ index, value, ...rest }) {
    return (
        <div className="numbox node" id={`node${index}`} {...rest}>
            {value}
        </div>
    );
}

export function Edge({ index, value, ...rest }) {
    return <div className="edge" id={`edge${index}`} {...rest} />;
}
