import sys

def update():
    with open('components/strategy/ExteriorDesignStep.tsx', 'r') as f:
        content = f.read()
        
    start_str = "// Build House\n      for (let f = 0; f < numFloors; f++) {"
    end_str = "buildingGroup.add(pillar)\n         }\n      }"
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find boundaries")
        return
        
    end_idx += len(end_str)
    
    replacement = """// Build House
      if (hasBlueprint) {
         // ADVANCED EXTRACTED 3D MODEL
         for (let f = 0; f < numFloors; f++) {
           const wallMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(selectedScheme.colors.wall) })
           
           // Main Wing
           const mainWing = new THREE.Mesh(new THREE.BoxGeometry(bLen, floorH, bWid * 0.6), wallMat)
           mainWing.userData.type = 'wall'
           mainWing.position.set(0, f * floorH + floorH / 2, -bWid * 0.2)
           buildingGroup.add(mainWing)

           // Multi-Wing L-Shape
           const sideWing = new THREE.Mesh(new THREE.BoxGeometry(bLen * 0.4, floorH, bWid * 0.4), wallMat)
           sideWing.userData.type = 'wall'
           sideWing.position.set(-bLen * 0.3, f * floorH + floorH / 2, bWid * 0.3)
           buildingGroup.add(sideWing)

           // Blueprint Slabs
           const mainSlab = new THREE.Mesh(new THREE.BoxGeometry(bLen + 0.2, 0.15, bWid * 0.6 + 0.2), new THREE.MeshLambertMaterial({ color: 0x888888 }))
           mainSlab.position.set(0, f * floorH, -bWid * 0.2)
           buildingGroup.add(mainSlab)
           
           const sideSlab = new THREE.Mesh(new THREE.BoxGeometry(bLen * 0.4 + 0.2, 0.15, bWid * 0.4 + 0.2), new THREE.MeshLambertMaterial({ color: 0x888888 }))
           sideSlab.position.set(-bLen * 0.3, f * floorH, bWid * 0.3)
           buildingGroup.add(sideSlab)

           // Large Glazing (Blueprint detailed windows)
           const winPerWing = Math.max(1, Math.floor(bLen * 0.4) - 1)
           for (let w = 0; w < winPerWing; w++) {
             const xPos = -bLen * 0.5 + (w + 1) * (bLen * 0.4 / (winPerWing + 1))
             const frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, floorH * 0.8, 1.4), new THREE.MeshLambertMaterial({ color: new THREE.Color(selectedScheme.colors.trim) }))
             frame.userData.type = 'window_frame'
             frame.position.set(xPos, f * floorH + floorH * 0.5, bWid * 0.1)
             buildingGroup.add(frame)
           }

           // Pitched Modern Roof (Top Floor Only)
           if (f === numFloors - 1) {
              const roofMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(selectedScheme.colors.accent || selectedScheme.colors.trim) })
              const roofGeo = new THREE.ConeGeometry(Math.max(bLen, bWid) * 0.8, 2, 4)
              const roof = new THREE.Mesh(roofGeo, roofMat)
              roof.userData.type = 'roof'
              roof.rotation.y = Math.PI / 4
              roof.position.set(-bLen * 0.15, (f + 1) * floorH + 1, 0)
              buildingGroup.add(roof)
           }
         }
      } else {
         // STANDARD ROUGH BOX MODEL
         for (let f = 0; f < numFloors; f++) {
           const wallMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(selectedScheme.colors.wall) })
           const wall = new THREE.Mesh(new THREE.BoxGeometry(bLen, floorH, bWid), wallMat)
           wall.userData.type = 'wall'
           wall.position.y = f * floorH + floorH / 2
           buildingGroup.add(wall)

           // Slab
           const slab = new THREE.Mesh(
             new THREE.BoxGeometry(bLen + 0.2, 0.15, bWid + 0.2),
             new THREE.MeshLambertMaterial({ color: 0x888888 })
           )
           slab.position.y = f * floorH
           buildingGroup.add(slab)

           // Windows (Front face only)
           const winsPerFloor = Math.max(2, Math.floor(bLen / 2))
           for (let w = 0; w < winsPerFloor; w++) {
              const xPos = (w - (winsPerFloor - 1) / 2) * (bLen / (winsPerFloor + 0.5))
              const frameGeo = new THREE.BoxGeometry(0.12, 1.6, 1.3)
              const frame = new THREE.Mesh(frameGeo, new THREE.MeshLambertMaterial({ color: new THREE.Color(selectedScheme.colors.trim) }))
              frame.userData.type = 'window_frame'
              frame.position.set(bLen / 2 + 0.06, f * floorH + floorH * 0.55, xPos)
              buildingGroup.add(frame)

              const glass = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 1.4, 1.1),
                new THREE.MeshLambertMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.5 })
              )
              glass.userData.type = 'glass'
              glass.position.set(bLen / 2 + 0.04, f * floorH + floorH * 0.55, xPos)
              buildingGroup.add(glass)
           }
         }

         // Roof
         const roof = new THREE.Mesh(
           new THREE.BoxGeometry(bLen + 0.4, 0.4, bWid + 0.4),
           new THREE.MeshLambertMaterial({ color: new THREE.Color(selectedScheme.colors.roof) })
         )
         roof.userData.type = 'roof'
         roof.position.y = numFloors * floorH + 0.2
         buildingGroup.add(roof)

         // Door
         const door = new THREE.Mesh(
           new THREE.BoxGeometry(0.12, 2.5, 1.4),
           new THREE.MeshLambertMaterial({ color: new THREE.Color(selectedScheme.colors.door) })
         )
         door.userData.type = 'door'
         door.position.set(bLen / 2 + 0.06, 1.25, 0)
         buildingGroup.add(door)

         // Balcony
         if (numFloors > 1) {
            const slab = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, bWid * 0.5), new THREE.MeshLambertMaterial({ color: 0xCCCCCC }))
            slab.position.set(bLen / 2 + 0.125, floorH + 0.1, 0)
            buildingGroup.add(slab)
            
            const railMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(selectedScheme.colors.railing) })
            for(let p = -3; p <= 3; p++) {
               const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), railMat)
               pillar.userData.type = 'railing'
               pillar.position.set(bLen / 2 + 0.2, floorH + 0.65, p * (bWid * 0.1))
               buildingGroup.add(pillar)
            }
         }
      }"""

    new_content = content[:start_idx] + replacement + content[end_idx:]
    with open('components/strategy/ExteriorDesignStep.tsx', 'w') as f:
        f.write(new_content)
    print("Done")

update()
