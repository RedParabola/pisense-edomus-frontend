import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * ShowLgDirective directive. Specifies that the given element and its childs must be showed if screen size is LG.
 */
@Directive({selector: '[show-lg]'})
export class ShowLgDirective {
  /**
   * ShowLgDirective constructor. It adds class 'mfw-show-lg' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-show-lg');
  }
}
