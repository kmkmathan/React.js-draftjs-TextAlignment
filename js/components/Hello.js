// var React = require("react");
// import {Editor,EditorState,RichUtils} from "draft-js";
// export default class Hello extends React.Component {
//  constructor(props) {
//     super(props);
//     this.state = {editorState: EditorState.createEmpty()};
//     this.onChange = (editorState) => this.setState({editorState});
//     this.handleKeyCommand = this.handleKeyCommand.bind(this);
//   }
//   handleKeyCommand(command) {
//     const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
//     if (newState) {
//       this.onChange(newState);
//       return true;
//     }
//     return false;
//   }
//     _onBoldClick() {
//     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
//   }

//   render() {
//     return (<div>
//     <button onClick={this._onBoldClick.bind(this)}>Bold</button>
//       <Editor
//         editorState={this.state.editorState}
//         handleKeyCommand={this.handleKeyCommand}
//         onChange={this.onChange}
//       />
//       </div>
//     );
//   }
// }
import React                            from "react";
import {Editor, EditorState, RichUtils, convertToRaw} from "draft-js";

export default class App extends React.Component {

  constructor(props) {
          super(props);

          this.state = {
            editorState: EditorState.createEmpty(),
          };

          this.focus = () => this.refs.editor.focus();
          this.onChange = (editorState) => this.setState({editorState});

          this.handleKeyCommand = (command) => this._handleKeyCommand(command);
          this.toggleBlockType = (type) => this._toggleBlockType(type);
          this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
        }

        _handleKeyCommand(command) {
          const {editorState} = this.state;
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
            this.onChange(newState);
            return true;
          }
          return false;
        }

        _toggleBlockType(blockType) {
          this.onChange(
            RichUtils.toggleBlockType(
              this.state.editorState,
              blockType
            )
          );
        }

        _toggleInlineStyle(inlineStyle) {
          this.onChange(
            RichUtils.toggleInlineStyle(
              this.state.editorState,
              inlineStyle
            )
          );
        }

        render() {
          const {editorState} = this.state;

          // If the user changes block type before entering any text, we can
          // either style the placeholder or hide it. Let's just hide it now.
          let className = 'RichEditor-editor';
          var contentState = editorState.getCurrentContent();
          if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
              className += ' RichEditor-hidePlaceholder';
            }
          }

          return (
            <div className="RichEditor-root">
              <BlockStyleControls
                editorState={editorState}
                onBlockToggle={this.toggleBlockType}
                onInlineToggle={this.toggleInlineStyle}
              />
              <div className={className} onClick={this.focus}>
                <Editor
                  blockStyleFn={getBlockStyle}
                  
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  ref="editor"
                  spellCheck={true}
                />
              </div>
            </div>
          );
        }
      }

      function getBlockStyle(block) {
        switch (block.getType()) {
          case 'alignLeft': return 'RichEditor-alignLeft';
          case 'alignCenter': return 'RichEditor-alignCenter';
          case 'alignRight': return 'RichEditor-alignRight';
          default: return null;
        }
      }

      class StyleButton extends React.Component {
        constructor() {
          super();
          this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
          };
        }

        render() {
          let className = 'RichEditor-styleButton';
          if (this.props.active) {
            className += ' RichEditor-activeButton';
          }

          return (
            <span className={className+" "+this.props.className} onMouseDown={this.onToggle}>
            </span>
          );
        }
      }

      const BlockStyleControls = (props) => {
        const {editorState} = props;
        const selection = editorState.getSelection();
        var currentStyle = props.editorState.getCurrentInlineStyle();
        const blockType = editorState
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType();

        return (
          <div className="RichEditor-controls">            
               <StyleButton
               className={"icons fa fa-bold"}
                active={currentStyle.has('BOLD')}
                onToggle={props.onInlineToggle}
                style={'BOLD'}
              />
               <StyleButton
               className={"icons fa fa-italic"}
                active={currentStyle.has('ITALIC')}
                onToggle={props.onInlineToggle}
                style={'ITALIC'}
              />
              <StyleButton
                className={"icons fa fa-list"}
                active={'unordered-list-item' === blockType}
                onToggle={props.onBlockToggle}
                style={'unordered-list-item'}
              /> 
              <StyleButton
                className={"icons fa fa-align-left"}
                active={'alignLeft' === blockType}
                onToggle={props.onBlockToggle}
                style={'alignLeft'}
              /> 
              <StyleButton
                className={"icons fa fa-align-center"}
                active={'alignCenter' === blockType}
                onToggle={props.onBlockToggle}
                style={'alignCenter'}
              />  
              <StyleButton
                className={"icons fa fa-align-right"}
                active={'alignRight' === blockType}
                onToggle={props.onBlockToggle}
                style={'alignRight'}
              />          
          </div>
        );
      };
 