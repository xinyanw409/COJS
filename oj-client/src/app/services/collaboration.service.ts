import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/colors';

declare const io: any;
declare const ace: any;
@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  clientsInfo: Object = {};
  clientNum: number = 0;
  constructor() { }

  init(editor: any, sessionId: string): void {
    // handshake, send sessionId
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});

    // change event handler
    this.collaborationSocket.on('change', (delta: string) => {
      console.log('collaboration: editor changes by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      // apply changes received from server to ace editor
      editor.getSession().getDocument().applyDeltas([delta]);
    });

    // cursorMove event handler
    this.collaborationSocket.on('cursorMove', (cursor) => {
      console.log('cursor move: ' + cursor);
      const session = editor.getSession();
      cursor = JSON.parse(cursor);
      const x = cursor['row'];
      const y = cursor['column'];
      const changeClientId = cursor['socketId'];
      
      if (changeClientId in this.clientsInfo) {
        // if the changeClientId(socket.id) is already in the clientsInfo
        // remove the original marker
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
      } else {
        // it's a new client, assign a new color to the new client
        this.clientsInfo[changeClientId] = {};
        const css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = '.editor_cursor_' + changeClientId
           + '{ position: absolute; background: ' + COLORS[this.clientNum] + ';'
          + 'z-index: 100; width: 3px !important; }';
        document.body.appendChild(css);
        this.clientNum++;
      }

      // draw a new marker, marker is not supported by ace, we draw a range instead
      // the range is very slim, only 3px, so it looks like a cursor
      const Range = ace.require('ace/range').Range;
      const newMarker = session.addMarker(new Range(x, y, x, y+1),
                                          'editor_cursor_' + changeClientId,
                                          true);
      this.clientsInfo[changeClientId]['marker'] = newMarker;
    });
  }

  change(delta: string): void {
    this.collaborationSocket.emit('change', delta);
  }

  cursorMove(cursor: string): void {
    this.collaborationSocket.emit('cursorMove', cursor);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit('restoreBuffer');
  }
}
