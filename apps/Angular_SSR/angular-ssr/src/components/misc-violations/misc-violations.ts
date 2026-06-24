import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-misc-violations',
  imports: [],
  templateUrl: './misc-violations.html',
  styleUrl: './misc-violations.css',
})
export class MiscViolationsComponent implements OnInit {
  showContent = true;

  ngOnInit() {
    setTimeout(() => {
      this.showContent = false;
    }, 20000);
  }
}
