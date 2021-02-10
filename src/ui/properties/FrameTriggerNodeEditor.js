import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import { ObjectGroup } from "styled-icons/fa-solid/ObjectGroup";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import useSetPropertySelected from "./useSetPropertySelected";
import { TriggerType } from "../../editor/nodes/FrameTriggerNode";

const triggerTypeOptions = [
  { label: "Megaphone", value: TriggerType.MEGAPHONE },
  { label: "Teleport", value: TriggerType.TELEPORT },
  { label: "Visibility (debug)", value: TriggerType.VISIBILITY },
  { label: "Switch active", value: TriggerType.SWITCH }
];

export default function FrameTriggerNodeEditor(props) {
  const { node, editor } = props;
  const onChangeTriggerType = useSetPropertySelected(editor, "triggerType");
  return (
    <NodeEditor description={FrameTriggerNodeEditor.description} {...props}>
      <InputGroup name="Trigger Types" info="Define the action of this triggered">
        <SelectInput options={triggerTypeOptions} value={node.triggerType} onChange={onChangeTriggerType} />
      </InputGroup>
    </NodeEditor>
  );
}

FrameTriggerNodeEditor.iconComponent = ObjectGroup;
FrameTriggerNodeEditor.description = "A frame to trigger actions.\n";

FrameTriggerNodeEditor.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.object
};

/*
To Do
Collision Mask für Avatare und Interactables als integer
Ziel für Teleport als Zielpunkt oder Zielobjekt siehe Trigger Volume
Switch active Zielobjekt und ob es an oder ausgeschaltet wird

Interactable Button
Position oder  Canvas für Text anzeigen bei Counter
*/
