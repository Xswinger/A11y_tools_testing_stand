import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-misc-violations',
  imports: [],
  templateUrl: './misc-violations.html',
  styleUrl: './misc-violations.css',
})
export class MiscViolationsComponent implements OnInit {
  ngOnInit() {
    setTimeout(() => {
      const elem = document.getElementById('timed-content');
      if (elem) {
        elem.innerHTML = '<p>Время истекло. Сообщение удалено.</p>';
      }
    }, 20000);
  }
}
