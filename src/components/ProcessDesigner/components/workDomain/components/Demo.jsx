import React, { Component, useEffect, useCallback, useRef, useState, createContext } from 'react';

class ListInfo extends Component {
  render() {
      const {time, name, content, avatar, subComment} = this.props;
      return (
          <li>
              <div><img src={avatar} alt="" height="20" width="20"/>{name} - {time}</div>
              <p>
                  {content}
              </p>
              <ul>
                  {
                      subComment 
                          ? subComment.map((item, i) => {
                              return <ListInfo key={i} {...item}/>
                          })
                          : 'empty'
                  }
              </ul>
          </li>
      )
  }
}
export default ListInfo