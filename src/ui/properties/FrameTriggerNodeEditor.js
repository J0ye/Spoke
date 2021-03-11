import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { ObjectGroup } from "styled-icons/fa-solid/ObjectGroup";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import BooleanInput from "../inputs/BooleanInput";
import NumericInput from "../inputs/NumericInput";
import StringInput from "../inputs/StringInput";
import useSetPropertySelected from "./useSetPropertySelected";
import { TriggerType } from "../../editor/nodes/FrameTriggerNode";
import EditorNodeMixin from "../../editor/nodes/EditorNodeMixin";

const triggerTypeOptions = [
  { label: "Megaphone", value: TriggerType.MEGAPHONE },
  { label: "Teleport", value: TriggerType.TELEPORT },
  { label: "Visibility (debug)", value: TriggerType.VISIBILITY },
  { label: "Switch active", value: TriggerType.SWITCH }
];

const componentOptions = [
  {
    label: "video",
    value: "video",
    nodeNames: ["Video"],
    propertyOptions: [{ label: "paused", value: "paused", component: "video", input: BooleanInput, default: false }]
  },
  {
    label: "loop-animation",
    value: "loop-animation",
    nodeNames: ["Model"],
    propertyOptions: [
      { label: "paused", value: "paused", component: "loop-animation", input: BooleanInput, default: false }
    ]
  }
];


export default class FrameTriggerNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object,
    multiEdit: PropTypes.bool
  };

  static iconComponent = ObjectGroup;

  static description = "A frame to trigger actions.\n";

  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }


  onChangeTriggerType = triggerType => {
    this.props.editor.setPropertiesSelected({ triggerType });
    console.log("trigger type is:", triggerType);
  };

  onChangeTarget = target => {
    this.props.editor.setPropertiesSelected({
      target,
      enterComponent: null,
      enterProperty: null,
      enterValue: null,
      leaveComponent: null,
      leaveProperty: null,
      leaveValue: null
    });
    let targetName;
    for (let i = 0; i < this.state.options.length; i++) {
      if (this.state.options[i].value === target) {
        targetName = this.state.options[i].label;
        console.log("Target: ", targetName);
      }
    }
    this.props.editor.setPropertiesSelected({ targetName });
  };

  onChangeCollisionMask = cMask => {
    this.props.editor.setPropertiesSelected({ cMask });
    console.log("collision mask is:", cMask);
  };

  onChangeSwitchActive = switchActive => {
    this.props.editor.setPropertiesSelected({ switchActive });
    console.log("collision mask is:", switchActive);
  };

  componentDidMount() {
    const options = [];

    const sceneNode = this.props.editor.scene;

    sceneNode.traverse(o => {
      if (o.isNode && o !== sceneNode) {
        options.push({ label: o.name, value: o.uuid, nodeName: o.nodeName });
      }
    });
    this.setState({ options });
  }

  render() {
    const { node, multiEdit } = this.props;

    const targetOption = this.state.options.find(o => o.value === node.target);
    const target = targetOption ? targetOption.value : null;
    const targetNotFound = node.target && target === null;
    const filteredComponentOptions = targetOption
      ? componentOptions.filter(o => o.nodeNames.indexOf(targetOption.nodeName) !== -1)
      : [];

    return (
      <NodeEditor description={FrameTriggerNodeEditor.description} {...this.props}>
        <InputGroup name="Trigger Types" info="Define the action of this triggered">
          <SelectInput options={triggerTypeOptions} value={node.triggerType} onChange={this.onChangeTriggerType} />
        </InputGroup>
        <InputGroup
          name="Collision Mask"
          info="Define a mask of the possible layers for a collision."
        >
          <NumericInput
            min={0}
            max={32}
            smallStep={1}
            mediumStep={4}
            largeStep={8}
            value={node.cMask}
            onChange={this.onChangeCollisionMask}
          />
        </InputGroup>
        {node.triggerType !== TriggerType.MEGAPHONE && (
          // do not ask for a target if it is a megphone trigger
          <>
            <InputGroup name="Target">
              <SelectInput
                error={targetNotFound}
                placeholder={targetNotFound ? "Error missing node." : "Select node..."}
                value={node.target}
                onChange={this.onChangeTarget}
                options={this.state.options}
                disabled={multiEdit}
              />
            </InputGroup>
            {node.triggerType === TriggerType.SWITCH && (
              // only ask for a switch, if the trigger type is a switch object active type 
              <>
                <InputGroup name="New state of target"
                  info="The state of the target will be set to either active (true) or inactive (false), when the trigger is activated.">
                  <BooleanInput value={node.switchActive} onChange={this.onChangeSwitchActive} />
                </InputGroup>
              </>
            )}
          </>
        )}
      </NodeEditor>
    );
  }
}

/*
To Do
Interactable Button
Position oder  Canvas für Text anzeigen bei Counter
*/
