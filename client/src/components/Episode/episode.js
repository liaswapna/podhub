import React from "react";
import "./style.css";

function Episode({ episodeId, name, date, length, description, Button }) {
  return (

    <div className="container rounded-0 border-0 card">

        <div className="col">

          {/* Name | Date */}
          <div className="row">{name} &nbsp;|&nbsp; {date}</div>

          <div className="border rounded">

            {/* Episode Description */}
            <span>{description}<br/></span>
            <span>Length:{length}<br/></span>

            {/* Listen Button */}
            <Button />
        </div>
      </div>
</div>

  );
}

export default Episode;

