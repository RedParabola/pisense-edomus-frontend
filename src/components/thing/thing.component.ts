// Basic
import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, OnInit, OnDestroy } from '@angular/core';

// Thing components
import { ThingComponentAbstract } from './thing-components/thing-component.abstract';
import { LightComponent } from './thing-components/light-component/light.component';
import { AirConditionerComponent } from './thing-components/ac-component/ac.component';
import { HumidifierComponent } from './thing-components/humidifier-component/humidifier.component';

// Models
import { ThingModel } from '../../core/model/thing.model';

/**
 * Component for each thing in the room.
 */
@Component({ selector: 'thing', templateUrl: './thing.component.html' })
export class ThingComponent implements OnInit, OnDestroy {

  /**
   * Child container in our view can be accessed from our parent component easily.
   */
  @ViewChild('container', { read: ViewContainerRef }) public container: ViewContainerRef;

  /**
   * The info for the represented thing.
   */
  @Input() public thing: ThingModel;

  /**
   * Represents an instance of a Component created via a ComponentFactory.
   */
  private componentRef: ComponentRef<{}>;

  /**
   * Mapping of the differents thing types.
   */
  private mappings: any;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param componentFactoryResolver Factory used to dinamically render components.
   */
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.mappings = {};
    this.mappings[ThingModel.LIGHT] = LightComponent;
    this.mappings[ThingModel.AC] = AirConditionerComponent;
    this.mappings[ThingModel.HUMIDIFIER] = HumidifierComponent;
  }

  public ngOnInit() {
    if (this.thing.type) {
      const componentType = this.mappings[this.thing.type];
      const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
      this.componentRef = this.container.createComponent(factory);
      // set component data
      const instance = this.componentRef.instance as ThingComponentAbstract;
      instance.thing = this.thing;
    }
  }

  /**
   * Destroy the reference of the component
   */
  public ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}
