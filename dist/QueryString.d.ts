import qs from 'qs';
declare const QueryString: {
    parse: (str: string) => qs.ParsedQs;
    stringify: (str: string) => string;
};
export default QueryString;
