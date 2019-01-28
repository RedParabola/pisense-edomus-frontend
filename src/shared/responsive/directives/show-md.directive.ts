import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * ShowMdDirective directive. Specifies that the given element and its childs must be showed if screen size is MD.
 */
@Directive({selector: '[show-md]'})
export class ShowMdDirective {
  /**
   * ShowMdDirective constructor. It adds class 'mfw-show-md' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-show-md');
  }
}
