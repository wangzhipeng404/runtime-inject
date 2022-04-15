export function mergeResult (resultData, appealData, type = 'skuCount') {
  let ownSkuInfoMap = {};
  let skuInfoMap = {};
  const {ownSkuInfos, skuInfo} = resultData;
  ownSkuInfos.forEach (info => {
    ownSkuInfoMap[info.skuCode] = JSON.parse (JSON.stringify (info));
  });
  skuInfo.forEach (info => {
    skuInfoMap[info.skuCode] = JSON.parse (JSON.stringify (info));
  });
  appealData.forEach (sku => {
    if (ownSkuInfoMap[sku.skuCode]) {
      if (type == 'layer') {
        // 有分层的申诉
        let layerCountDetail = ownSkuInfoMap[sku.skuCode]
          .layerCountDetail || [];
        let sum = 0;
        let flag = true;
        for (var i = 0; i < layerCountDetail.length; i++) {
          let one = layerCountDetail[i];
          if (one.layer == sku.layer) {
            // 申诉原来的产品
            one.isAppealLayer = sku.appealLayer ? true : false;
            one.isAppealCount = sku.appealCount ? true : false;
            one.appealLayer = sku.appealLayer || one.layer;
            one.auditLayer = sku.appealLayer || one.layer;
            one.count = sku.appealCount ? +sku.appealCount : +sku.skuCount;
            one.appealCount = sku.appealCount
              ? +sku.appealCount
              : +sku.skuCount;
            one.auditCount = sku.appealCount ? +sku.appealCount : +sku.skuCount;
            flag = false;
            break;
          }
        }
        if (flag) {
          // 申诉新的产品或者产品新的层数
          layerCountDetail.push ({
            isAppealLayer: true,
            isAppealCount: true,
            layer: sku.appealLayer,
            appealLayer: sku.appealLayer,
            auditLayer: sku.appealLayer,
            count: sku.appealCount ? +sku.appealCount : +sku.skuCount,
            appealCount: sku.appealCount ? +sku.appealCount : +sku.skuCount,
            auditCount: sku.appealCount ? +sku.appealCount : +sku.skuCount,
          });
        }
        layerCountDetail.forEach (item => {
          sum += +item.count;
        });
        ownSkuInfoMap[sku.skuCode].skuCount = sum;
        ownSkuInfoMap[sku.skuCode].appealCount = +sku.appealCount;
        ownSkuInfoMap[sku.skuCode].auditCount = +sku.appealCount;
      } else if (type == 'skuCount' && sku.appealCount) {
        //只申诉排面
        ownSkuInfoMap[sku.skuCode].skuCount = +sku.appealCount;
        ownSkuInfoMap[sku.skuCode].appealCount = +sku.appealCount;
        ownSkuInfoMap[sku.skuCode].auditCount = +sku.appealCount;
      }
    } else {
      sku.layerCountDetail = [
        {
          layer: sku.appealLayer,
          appealLayer: sku.appealLayer,
          isAppealLayer: true,
          isAppealCount: true,
          auditLayer: sku.appealLayer,
          count: sku.appealCount ? +sku.appealCount : +sku.skuCount,
          appealCount: sku.appealCount ? +sku.appealCount : +sku.skuCount,
          auditCount: sku.appealCount ? +sku.appealCount : +sku.skuCount,
        },
      ];
      sku.layerDetail = sku.appealLayer;
      sku.locations = [];
      for (let i = 0; i < sku.appealCount; i++) {
        sku.locations.push ({layer: sku.appealLayer});
      }
      sku.skuCount = +sku.appealCount || 0;
      sku.auditCount = +sku.appealCount;
      ownSkuInfoMap[sku.skuCode] = JSON.parse (JSON.stringify (sku));
    }
    if (skuInfoMap[sku.skuCode]) {
      if (type == 'layer') {
        // 有分层的申诉
        let layerCountDetail = skuInfoMap[sku.skuCode].layerCountDetail || [];
        let sum = 0;
        let flag = true;
        for (let j = 0; j < layerCountDetail.length; j++) {
          let one = layerCountDetail[j];
          if (one.layer == sku.layer) {
            // 申诉原来的产品
            one.count = sku.appealCount ? +sku.appealCount : +sku.skuCount;
            one.isAppealLayer = sku.appealLayer ? true : false;
            one.isAppealCount = sku.appealLayer ? true : false;
            one.appealCount = sku.appealCount
              ? +sku.appealCount
              : +sku.skuCount;
            one.auditCount = sku.appealCount ? +sku.appealCount : +sku.skuCount;
            one.auditLayer = sku.appealLayer || one.layer;
            one.appealLayer = sku.appealLayer || one.layer;
            flag = false;
            break;
          }
        }
        if (flag) {
          // 申诉新的产品或者产品新的层数
          layerCountDetail.push ({
            layer: sku.appealLayer,
            isAppealLayer: true,
            isAppealCount: true,
            appealLayer: sku.appealLayer,
            auditLayer: sku.appealLayer,
            count: sku.appealCount ? +sku.appealCount : +sku.skuCount,
            appealCount: sku.appealCount ? +sku.appealCount : +sku.skuCount,
            auditCount: sku.appealCount ? +sku.appealCount : +sku.skuCount,
          });
        }
        layerCountDetail.forEach (item => {
          sum += +item.count;
        });
        skuInfoMap[sku.skuCode].skuCount = sum;
        skuInfoMap[sku.skuCode].appealCount = +sku.appealCount;
        skuInfoMap[sku.skuCode].auditCount = +sku.appealCount;
      } else if (type == 'skuCount' && sku.appealCount) {
        //只申诉排面
        skuInfoMap[sku.skuCode].skuCount = +sku.appealCount;
        skuInfoMap[sku.skuCode].appealCount = +sku.appealCount;
        skuInfoMap[sku.skuCode].auditCount = +sku.appealCount;
      }
    } else {
      sku.layerCountDetail = [
        {
          layer: sku.appealLayer,
          appealLayer: sku.appealLayer,
          isAppealLayer: true,
          isAppealCount: true,
          auditLayer: sku.appealLayer,
          count: sku.appealCount ? +sku.appealCount : +sku.skuCount,
          appealCount: sku.appealCount ? +sku.appealCount : +sku.skuCount,
          auditCount: sku.appealCount ? +sku.appealCount : +sku.skuCount,
        },
      ];
      sku.layerDetail = sku.appealLayer;
      sku.locations = [];
      for (let i = 0; i < sku.appealCount; i++) {
        sku.locations.push ({layer: sku.appealLayer});
      }
      sku.skuCount = sku.appealCount || 0;
      skuInfoMap[sku.skuCode] = JSON.parse (JSON.stringify (sku));
    }
  });

  const ownSkuInfosArr = Object.values (ownSkuInfoMap);
  const skuInfoArr = Object.values (skuInfoMap);
  const ownSkuInfosNotNull = ownSkuInfosArr.filter (sku => sku.skuCount != 0);
  const skuInfoNotNull = skuInfoArr.filter (sku => sku.skuCount != 0);
  const ownSkuNum = ownSkuInfosNotNull.reduce ((acc, cur) => {
    return acc + Number (cur.skuCount);
  }, 0);
  const allSkuNum = skuInfoNotNull.reduce ((acc, cur) => {
    return acc + Number (cur.skuCount);
  }, 0);
  const ownPurity = (ownSkuNum / allSkuNum * 100).toFixed (2) + '%';
  const layerSet = new Set ();
  let isGold = false;
  ownSkuInfosNotNull.forEach (sku => {
    sku.layerCountDetail.forEach (one => {
      if (one.layer == 2 || one.layer == 3) {
        isGold = true;
      }
      layerSet.add (one.layer);
    });
    //const ownPurity = (ownSkuInfosNotNull.length*2/(ownSkuInfosNotNull.length+resultData.competeSkuTypeNum)).toFixed(2) + '%;'
  });
  return {
    ...resultData,
    ownSkuInfos: ownSkuInfosArr,
    skuInfo: skuInfoArr,
    ownPurity,
    ownSkuNum,
    allSkuNum,
    ownSkuTypeNum: ownSkuInfosNotNull.length,
    ownDisplayLayerNum: layerSet.size,
    shelfDistributionRate: ownSkuInfosNotNull.length * 2 + '%',
    goldLocationDetection: isGold,
  };
}

export function formatProduct (list) {
  let result = [];
  list.forEach (item => {
    let kObj = {};
    let obj = {};
    item.locations.forEach (one => {
      if (!kObj[one.layer]) {
        obj = JSON.parse (JSON.stringify (item));
        obj.id = obj.skuName + one.layer;
        obj.layer = one.layer;
        obj.skuCount = 1;
        kObj[one.layer] = true;
        obj.locations = [one];
        result.push (obj);
      } else {
        obj.skuCount++;
        obj.locations.push (one);
      }
    });
  });
  console.log (result);
  return result;
}
