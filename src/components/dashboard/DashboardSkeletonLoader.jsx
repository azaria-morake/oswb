import React from 'react';

const DashboardSkeletonLoader = () => (
  <div className="dsk-wrap">
    {/* Rail skeleton */}
    <div className="dsk-rail">
      <div className="dsk-skel dsk-skel--avatar" />
      <div className="dsk-skel dsk-skel--line dsk-skel--w60" style={{marginTop: 16}} />
      <div className="dsk-skel dsk-skel--line dsk-skel--w40" style={{marginTop: 8}} />
      <div style={{marginTop: 40}}>
        {[1,2,3].map(i => (
          <div key={i} className="dsk-skel dsk-skel--nav-item" style={{marginBottom: 12}} />
        ))}
      </div>
    </div>

    {/* Main content skeleton */}
    <div className="dsk-main">
      <div className="dsk-skel dsk-skel--title" />
      <div className="dsk-skel dsk-skel--subtitle" style={{marginTop: 10}} />
      <div style={{marginTop: 40}}>
        {[1,2,3,4].map(i => (
          <div key={i} className="dsk-skel dsk-skel--row" style={{marginBottom: 16}} />
        ))}
      </div>
    </div>
  </div>
);

export default DashboardSkeletonLoader;
