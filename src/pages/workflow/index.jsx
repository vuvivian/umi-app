import React, { useState, useRef } from 'react';
import ProcessDesignerBasic from '../../components/ProcessDesigner-Basic'
import ProcessDesigner from '../../components/ProcessDesigner-CustomModeler'
const WorkFlow = () => {
  return (
   <div>
      <ProcessDesignerBasic/>
      <ProcessDesigner></ProcessDesigner>
   </div>
  )
}

export default WorkFlow