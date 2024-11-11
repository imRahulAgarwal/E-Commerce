import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";

const Audit = () => {
    const { auditId } = useParams();
    const [audit, setAudit] = useState(null);

    useEffect(() => {
        adminPanelService.getAudit(auditId).then((data) => {});
    }, [auditId]);

    if (!audit) {
        return <p>Loading...</p>;
    }

    return <div>Audit</div>;
};

export default Audit;
