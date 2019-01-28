//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar } from 'ionic-angular';

//Services

/**
 * Assistant page.
 */
@IonicPage({ name: 'page-assistant', segment: 'assistant' })
@Component({ selector: 'page-assistant', templateUrl: 'assistant.html' })
export class AssistantPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Assistant page constructor.
   */
  constructor() {
  }

}
