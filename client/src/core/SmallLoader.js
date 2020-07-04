import React, { useState, useEffect } from "react";
import "../css/reviewLoading.css"

const SmallLoader = ({ visible }) => {

    return visible && (
        <div className="row justify-content-center">
            <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default SmallLoader