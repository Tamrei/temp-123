import Modeler from "bpmn-js/lib/Modeler";

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import "../css/styles.css";
import $ from "jQuery";

import diagram from "../resources/modeling-api.bpmn";

const container = document.getElementById("container");

const modeler = new Modeler({
  container,
  keyboard: {
    bindTo: document
  },
  additionalModules: [propertiesPanelModule, propertiesProviderModule],
  propertiesPanel: {
    parent: "#properties-panel-parent"
  }
});
let canvas = null;
let moddle = null;
let modeling = null;
let bpmnFactory = null;
let elementRegistry = null;
let eventBus = null;
let elementFactory = null;

modeler
  .importXML(diagram)
  .then(({ warnings }) => {
    if (warnings.length) {
      console.log(warnings);
    }

    canvas = modeler.get("canvas");
    moddle = modeler.get("moddle");
    modeling = modeler.get("modeling");
    bpmnFactory = modeler.get("bpmnFactory");
    elementRegistry = modeler.get("elementRegistry");
    eventBus = modeler.get("eventBus");
    elementFactory = modeler.get("elementFactory");

    canvas.zoom("fit-viewport");
    console.log(diagram);

    // you may hook into any of the following events
    // var events = ["element.click", "element.dblclick"];

    // eventBus.on([...events], function (e) {
    //   // console.log(event, "on", e.element.id, e.gfx);
    //   const taskElement = elementRegistry.get(e.element.id);
    //   let taskBusinessObject = taskElement.businessObject;
    //   console.log(taskBusinessObject.name);
    // });

    const events = [
      // "commandStack.elements.create.postExecuted",
      // "commandStack.elements.delete.postExecuted",
      // "commandStack.elements.move.postExecuted",
      // "elements.changed",
      "elements.delete",
      "element.changed"
      // "element.click",
      // "element.dblclick"
    ];

    const events2 = [
      { event: "elements.delete", priority: 2000 },
      { event: "element.changed", priority: 1000 }
    ];

    events.forEach(function (event) {
      eventBus.on(event, function (e) {
        // e.element = the model element
        // e.gfx = the graphical element
        // console.log(event, e);
        const taskElement = elementRegistry.get(e.element.id);
        if (taskElement) {
          let taskBusinessObject = taskElement.businessObject;
          console.log(
            e.element.id + "는 변경 또는 추가 하시오.",
            taskBusinessObject,
            e.gfx
          );
        } else {
          console.log(e.element.id + "는 삭제 하시오.");
        }
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

const showDebugData = function () {
  console.log("showDebugData");
};
const showElements = function () {
  console.log("showElements");
};

const doDebugFunction1 = () => {
  console.log(doDebugFunction1);
  /**
   *  bpmn-js의 새 인스턴스를 만든 후 modeler#get을 사용하여
   *  bpmn-js의 모든 모듈에 액세스 할 수 있다.
   *
   * 이 예에서 사용 된 모듈은 다음과 같다.
   *
   * * ElementFactory: 새로운 모양과 연결을 만든다.
   * * ElementRegistry: 다이어그램의 모든 모양과 연결에 대한 레지스트리
   * * Modeling: 모델링을위한 메인 모듈.
   *
   * 이 모듈을 사용하여 새 shape를 만들고 다이어그램에 추가 한 다음 기존 shape와 연결한다.
   */

  // (1) Get the modules
  // const elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) 기존 process와 start event 가져오기
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // (3) 신규 diagram shape 생성
  const task = elementFactory.createShape({ type: "bpmn:Task" });

  // (4) diagram에 신규 task 추가
  modeling.createShape(task, { x: 400, y: 500 }, process);

  // 이제 element registry를 통해 신규 task를 액세스 가능하다.
  console.log(elementRegistry.get(task.id)); // Shape { "type": "bpmn:Task", ... }

  // (5) 신규 task를 존재하는 start event task에 연결
  modeling.connect(startEvent, task);
};
const doDebugFunction2 = () => {
  console.log("Business Objects");
  /**
   * Business object는 shape 또는 connection의 모든 BPMN 관련
   * 속성을 보유하는 모델 개체이다.
   * element의`businessObject` 속성을 통해 액세스 할 수 있다.
   * 모든 모델 객체가 shape나 connecton으로 표시되는 것은 아니다.
   * 예를 들어 이벤트 정의는 이벤트 형태의 비즈니스 오브젝트의
   * 일부인 모델 오브젝트입니다.
   *
   * 전체 BPMN model을 찾으려면 : https://github.com/bpmn-io/bpmn-moddle/blob/master/resources/bpmn/json/bpmn.json
   *
   * 이 예에서 사용 된 모듈 :
   *
   * * BpmnFactory: 신규 business object 생성
   * * ElementFactory: 신규 shape, connection 생성
   * * ElementRegistry: diagrma의 모든 shape, connection의 저장소
   * * Modeling: modeling을 위한 main module
   *
   * 이 모듈을 사용하여
   * shape를 나타내는 신규 business object를 생성 -->
   * 생성 후 diagram에 추가 --> 기존의 shape에 연결
   */

  // (1) 모듈 가져오기
  // const bpmnFactory = modeler.get("bpmnFactory"),
  //   elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) 기존의 process와 start event 가져오기
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // start event의 business object를 액세스 할 수 있음
  console.log(startEvent.businessObject); // { "$type": "bpmn:StartEvent", ... }

  // (3) 자동적으로  business object를 생성하기 위해 element factory에 의존하는 대신 BPMN factory를 사용하여 생성
  const taskBusinessObject = bpmnFactory.create("bpmn:Task", {
    id: "Task_11",
    name: "Task"
  });

  // (4) 위에서 만든 business object를 사용하여 신규 diagram shape 생성
  const task = elementFactory.createShape({
    type: "bpmn:Task",
    businessObject: taskBusinessObject
  });

  // (5) diagram에 신규 task 추가
  modeling.createShape(task, { x: 400, y: 100 }, process);

  // `id` property를 사용하여 elementRegistry에서 신규 task 액세스 가능함
  console.log(elementRegistry.get("Task_1")); // Shape { "type": "bpmn:Task", ... }
};
const doDebugFunction3 = () => {
  console.log("Creating Shapes");
  /**
   * 좀더 복잡한 shape를 만들어 보자.
   *
   * 이 예제에 사용된 모듈 :
   *
   * * BpmnFactory: business object 생성
   * * ElementFactory: shape, connection 생성
   * * ElementRegistry: diagram의 shape, connection 저장소
   * * Modeling: modeling main 모듈
   *
   * 이 모듈을 사용하여 BoundaryEvent와 SubProcess를 포함한
   * shape를 만든다.
   */

  // (1) module 가져오기
  // const bpmnFactory = modeler.get("bpmnFactory"),
  //   elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) 기존의 process와 start event 가져오기
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // (3) service task shape 생성
  const serviceTask = elementFactory.createShape({ type: "bpmn:ServiceTask" });

  // (4) `appendShape`를 사용하여 diagram에 신규 service task
  // shape를 추가, 기존 shape에 연결
  modeling.appendShape(startEvent, serviceTask, { x: 400, y: 100 }, process);

  // (5) boundary event shape 생성
  const boundaryEvent = elementFactory.createShape({
    type: "bpmn:BoundaryEvent"
  });

  // (6) 신규 boundary event를 service taks에 부착하여 diagram에 추가
  modeling.createShape(boundaryEvent, { x: 400, y: 140 }, serviceTask, {
    attach: true
  });

  // (7) event sub process business object 생성
  const eventSubProcessBusinessObject = bpmnFactory.create("bpmn:SubProcess", {
    triggeredByEvent: true,
    isExpanded: true
  });

  // (8) SubProcess shape생성, 이전(7)에 생성한 event sub process business object 설정
  const eventSubProcess = elementFactory.createShape({
    type: "bpmn:SubProcess",
    businessObject: eventSubProcessBusinessObject,
    isExpanded: true
  });

  // (9) sub process를 diagram에 추가
  modeling.createShape(eventSubProcess, { x: 300, y: 400 }, process);

  // (10) 이벤트 정의가 추가되도록 `eventDefinitionType`
  // 지정하는 timer start event 생성
  const timerStartEvent = elementFactory.createShape({
    type: "bpmn:StartEvent",
    eventDefinitionType: "bpmn:TimerEventDefinition"
  });

  // (11) event sub process를 이벤트가 이것의 자식이 되도록
  // 대상으로 지정하는 diagram에 신규 timer start event 추가
  // 해석 확인 필요
  // Add the new timer start event to the diagram specifying the event sub process as the target
  // so the event will be a child of it
  modeling.createShape(timerStartEvent, { x: 200, y: 400 }, eventSubProcess);

  // (12) width와 height를 지정하여 신규 group shape 생성
  const group = elementFactory.createShape({
    type: "bpmn:Group",
    width: 400,
    height: 200
  });

  // (13) 신규 group을 diagram에 추가
  modeling.createShape(group, { x: 325, y: 100 }, process);

  // (14) 상대좌표 x, y를 지정하여 shape 2개 생성
  const messageStartEvent = elementFactory.createShape({
    type: "bpmn:StartEvent",
    eventDefinitionType: "bpmn:MessageEventDefinition",
    x: 0,
    y: 22
  });

  const userTask = elementFactory.createShape({
    type: "bpmn:UserTask",
    x: 100,
    y: 0
  });

  // (15) diagram에 만든 shape 추가
  modeling.createElements(
    [messageStartEvent, userTask],
    { x: 300, y: 600 },
    process
  );
};
const doDebugFunction4 = () => {
  console.log("Connecting Shapes");
  /**
   * 서로 다른 shape를 연결하는 다른 방법들을 보자.
   *
   * The modules used in this example are:
   *
   * * ElementFactory: shape, connection 생성
   * * ElementRegistry: diagram의 shape, connection 저장소
   * * Modeling: modeling main 모듈
   
  * shape와 connection을 만드는 두가지 방법을 살펴 보자
  * We will use these modules to create shapes and connect them on two different ways.
  */

  // (1) 모듈 가져오기
  // const elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) Get the existing process and the start event
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // (3) Create a task shape
  const task = elementFactory.createShape({ type: "bpmn:Task" });

  // (4) Add the new service task shape to the diagram
  modeling.createShape(task, { x: 400, y: 100 }, process);

  // (5) Connect the existing start event to new task using `connect`
  modeling.connect(startEvent, task);

  // (6) Create a end event shape
  const endEvent = elementFactory.createShape({ type: "bpmn:EndEvent" });

  // (7) Add the new end event shape to the diagram
  modeling.createShape(endEvent, { x: 600, y: 100 }, process);

  // (8) Create a new sequence flow connection that connects the task to the end event
  modeling.createConnection(
    task,
    endEvent,
    { type: "bpmn:SequenceFlow" },
    process
  );
};
const doDebugFunction5 = () => {
  /**
   * 지금까지 프로세스를 다루었다. 협업에 대해 살펴 보자
   * 사용된 모듈:
   *
   * * ElementFactory: shape, connection 생성
   * * ElementRegistry: diagram의 shape, connection 저장소
   * * Modeling: modeling main 모듈
   *
   * 이러한 모듈을 사용하여 참가자를 만들고 다이어그램에 추가하고 (따라서 프로세스를 협업으로 전환),
   * 레인을 만들고 메시지 흐름을 사용하여 참가자를 연결합니다.
   */

  // (1) 모듈 가져오기
  // const elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) 기존의 process와 start event 가져오기
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // (3) `createParticipantShape`를 사용하여 신규 participant shape 생성
  const participant = elementFactory.createParticipantShape({
    type: "bpmn:Participant"
  });

  // (4) 프로세스를 협업으로 전환하려는 diagram에 신규 participant 추가
  // Add the new participant to the diagram turning the process into a collaboration
  modeling.createShape(participant, { x: 400, y: 400 }, process);

  // 기존 start event는 이제 participant의 child 입니다.
  console.log(startEvent.parent); // Shape { "type": "bpmn:Participant", ... }

  // (5) lane 생성
  const lane = modeling.addLane(participant, "bottom");

  // (6) 2개의 nested lane 생성
  modeling.splitLane(lane, 2);

  // (7) 축소된 다른 participant shape 생성
  const collapsedParticipant = elementFactory.createParticipantShape({
    type: "bpmn:Participant",
    isExpanded: false
  });

  // (8) diagram에 participant 추가
  modeling.createShape(collapsedParticipant, { x: 300, y: 500 }, process);

  // (9) message flow를 통해 2개의 participan 연결
  // Connect the two participants through a message flow
  modeling.connect(collapsedParticipant, participant);
};
const doDebugFunction6 = () => {
  console.log("Edting Elements");
  /**
   * element를 편집하는 방법을 보자
   *
   * The modules used in this example are:
   *
   * *
   * * BpmnFactory: 신규 business objects.
   * * ElementRegistry: diagram의 shape, connection 저장소
   * * Modeling: modeling main 모듈
   *
   */

  // (1) 모듈 가져오기
  // const bpmnFactory = modeler.get("bpmnFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) shape 가져오기
  const startEvent = elementRegistry.get("StartEvent_1"),
    exclusiveGateway = elementRegistry.get("ExclusiveGateway_1"),
    sequenceFlow = elementRegistry.get("SequenceFlow_3"),
    task = elementRegistry.get("Task_1");

  // (3) `updateProperties`를 사용하여 start event의 `name` 변경
  modeling.updateProperties(startEvent, { name: "Foo" });

  // (4) gateway의 `defaultFlow` 속성 변경
  modeling.updateProperties(exclusiveGateway, {
    default: sequenceFlow.businessObject
  });

  // (5) task를 multi-instance(다중인스턴스)로 변경
  const multiInstanceLoopCharacteristics = bpmnFactory.create(
    "bpmn:MultiInstanceLoopCharacteristics"
  );

  modeling.updateProperties(task, {
    loopCharacteristics: multiInstanceLoopCharacteristics
  });
};

$(function () {
  $(document).on("click", "#js-debug-value", showDebugData);
  $(document).on("click", "#js-debug-value2", showElements);
  $(document).on("click", "#js-debug1", doDebugFunction1);
  $(document).on("click", "#js-debug2", doDebugFunction2);
  $(document).on("click", "#js-debug3", doDebugFunction3);
  $(document).on("click", "#js-debug4", doDebugFunction4);
  $(document).on("click", "#js-debug5", doDebugFunction5);
  $(document).on("click", "#js-debug6", doDebugFunction6);
});
