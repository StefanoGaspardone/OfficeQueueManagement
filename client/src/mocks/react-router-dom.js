const React = require('react');

function BrowserRouter({ children }) { return React.createElement(React.Fragment, null, children); }
function Routes({ children }) { return React.createElement(React.Fragment, null, children); }
// Route may be used with an `element` prop in this project. Return it if present.
function Route(props) { return props && props.element ? props.element : React.createElement(React.Fragment, null, props.children); }
function Navigate() { return null; }
function useNavigate() { return () => {}; }

module.exports = { BrowserRouter, Routes, Route, Navigate, useNavigate };
